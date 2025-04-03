import Blog from "../Models/blogmodels.js";
import { uploadOnCloudinary } from "./fileupload.js";

// Use a Map to track images for each postId
const imageMap = new Map();

// Handle image uploads and store URLs in the map
export const handleImageUploads = async (files, postId) => {
  if (!imageMap.has(postId)) {
    imageMap.set(postId, []); // Initialize empty array if not present
  }

  // Upload all images concurrently (faster!)
  const uploadPromises = files.map(async (file) => {
    const localFilePath = file.path;

    try {
      const uploadResult = await uploadWithRetry(localFilePath, 3);
      if (uploadResult) {
        imageMap.get(postId).push(uploadResult.secure_url); // Push to postId array
      } else {
        console.error(`⚠️ Upload failed for file: ${localFilePath}`);
      }

      return uploadResult.secure_urll
    } catch (error) {
      console.error(`❌ Error uploading ${localFilePath}: ${error.message}`);
    }
  });

  // Wait for all uploads to complete
  await Promise.all(uploadPromises);

  // 1️⃣ Update the correct blog post once all images are uploaded
  const uploadedImages = imageMap.get(postId) || [];
  if (uploadedImages.length > 0) {
    try {
      await Blog.findByIdAndUpdate(postId, {
        $set: { images: uploadedImages, status: 'published' },
      });
      console.log(`✅ Blog ${postId} updated successfully with ${uploadedImages.length} images.`);
      imageMap.delete(postId); // Cleanup after updating
    } catch (error) {
      console.error(`❌ Error updating blog ${postId}: ${error.message}`);
    }
  } else {
    console.warn(`⚠️ No images uploaded successfully for blog ${postId}, skipping DB update.`);
  }
};


export const handleImageUploadsV1 = async (file) => {
  if (!file) {
    console.error("⚠️ No file provided for upload.");
    return null;
  }

  const localFilePath = file.path;
  try {
    const uploadResult = await uploadWithRetry(localFilePath, 3);
    if (uploadResult) {
      console.log("✅ Image uploaded successfully:", uploadResult.secure_url);
      return uploadResult.secure_url;
    } else {
      console.error(`⚠️ Upload failed for file: ${localFilePath}`);
    }
  } catch (error) {
    console.error(`❌ Error uploading ${localFilePath}: ${error.message}`);
  }
  return null;
};

const uploadWithRetry = async (filePath, retries = 2, delay = 5000) => {
  let retry_attempt = 0;
  while (retry_attempt < retries) {
    try {
      const result = await uploadOnCloudinary(filePath);
      return result;
    } catch (error) {
      console.error(`❌ Attempt ${retry_attempt + 1} failed for ${filePath}`);
      retry_attempt++;
      if (retry_attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay * retry_attempt));
      }
    }
  }
  return null;
};


// Update post with image URL after successful upload
const updateBlogWithImage = async (postId,userId, imageUrl) => {
    try {
      await Blog.findByIdAndUpdate(postId, {
        $push: { images: imageUrl },
        status: 'published_images', // Set status to published after images upload
      });
  
      console.log(`📝 Blog updated with image: ${imageUrl}`);
    } catch (error) {
      console.error(`❌ Error updating blog with image: ${error.message}`);
    }
  };
  