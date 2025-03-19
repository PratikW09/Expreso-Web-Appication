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
    const response = await cloudinary.uploader.upload(localFilePath,
      {
        folder: 'blog_images',

      }

    );

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
// Delete from Cloudinary
const deleteFromCloudinary = async (url) => {
  try {
    
    
    if (!url) {
      console.error('⚠️ Error: No URL provided for deletion.');
      return;
    }

    // Extract publicId from URL
    const publicId = url.split('/').pop().split('.')[0];
    
    if (!publicId) {
      console.error('❌ Error: Unable to extract publicId from URL.');
      return;
    }

    // Construct full path with folder name
    const publicIdWithFolder = `blog_images/${publicId}`;
    
    const result = await cloudinary.uploader.destroy(publicIdWithFolder);

    
    if (result.result === 'ok') {
      console.log(`✅ Successfully deleted image: ${publicId}`);
    } else {
      console.error(`❌ Failed to delete image: ${publicId}, Reason: ${result.result}`);
    }
  } catch (error) {
    console.error('❌ Error deleting from Cloudinary:', error.message);
  }
};


export { uploadOnCloudinary ,deleteFromCloudinary };
