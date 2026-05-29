import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: "../.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryUpload =  async (localFilePath) => {
    try {
        if (!localFilePath) throw new Error("No file path provided");

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "intellmeet_avatars",
        });

        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); 
        return null;
    }
}

export {cloudinaryUpload};