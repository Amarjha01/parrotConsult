import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // file system of node js
import path from "path";

  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const uploadOnCloudinary = async (localFilePath, resourceType = "raw") => {
  try {
    if (!localFilePath) return null;

    const absolutePath = path.resolve(localFilePath); 
    const response = await cloudinary.uploader.upload(absolutePath, {
      resource_type: resourceType,
    });

    // Clean up local file
    fs.unlinkSync(absolutePath);
    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

export { uploadOnCloudinary };
