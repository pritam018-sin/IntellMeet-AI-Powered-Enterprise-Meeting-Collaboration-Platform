import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {cloudinaryUpload} from "../utils/cloudinaryService.js";

const generateAcessTokenAndRefreshToken = async(userId) =>{

    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
      await  user.save({validateBeforeSave: false});
      return { accessToken, refreshToken};

    }catch{error}{
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

const registerUser = asyncHandler(async (req, res) =>{
    const {email, password, name} = req.body;

      if(
        [name, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }
    const user = await User.findOne({email});

    if(user){
        throw new ApiError(400, "User already exists")
    }

    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }
    const avatar = await cloudinaryUpload(avatarLocalPath);

    const newUser = await User.create({
        email,
        password,
        name,
        avatar : avatar?.secure_url || "",
    });

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export {
    registerUser
};