import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { cloudinaryUpload } from "../utils/cloudinaryService.js";

const generateAccessTokenAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch {
    error;
  }
  {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ email });

  if (user) {
    throw new ApiError(400, "User already exists");
  }

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const avatar = await cloudinaryUpload(avatarLocalPath);

  const newUser = await User.create({
    email,
    password,
    name,
    avatar: avatar?.secure_url || "",
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }
  const isPasswordValid = await user.isValidPassword(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid email or password");
  }
  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "User logged out successfully", null));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh Toknen expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          "Access token refreshed successfully",
          {
            accessToken,
            newRefreshToken,
          }     
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  return res.status(200).json(user);
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (name?.trim() === "") {
    throw new ApiError(400, "Name cannot be empty");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        name: name?.trim(),
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Account details updated successfully", updatedUser)
    );
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await cloudinaryUpload(avatarLocalPath);

  const updatedAvatarUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar?.secure_url || "",
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Avatar updated successfully", updatedAvatarUser)
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if ([currentPassword, newPassword].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isCurrentPasswordValid = await user.isValidPassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new ApiError(400, "Current password is incorrect");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully", null));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  changeCurrentPassword,
};
