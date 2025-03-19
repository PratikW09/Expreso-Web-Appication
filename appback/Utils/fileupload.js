import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv"
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {

  try {
    if (!localFilePath) {
      console.error('❌ No file path provided for upload.');
      return null;
    }

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath);

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error(`❌ Error uploading to Cloudinary: ${error.message}`);

    // Remove local file if Cloudinary upload fails
    if (fs.existsSync(localFilePath)) {
      console.log(`🗑️ Cleaning up local file due to upload failure: ${localFilePath}`);
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };
