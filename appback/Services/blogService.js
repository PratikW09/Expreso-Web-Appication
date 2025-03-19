import Blog from "../Models/blogmodels.js";
import { deleteFromCloudinary, uploadOnCloudinary } from '../Utils/fileupload.js';

export const createBlogService = async ({ userId, title, content, author, tags, images }) => {
  const newBlog = new Blog({
    user_id:userId,
    title,
    content,
    author,
    tags,
    images, // Store Cloudinary URLs
  });
  console.log(`✅ Blog saved with ID: ${newBlog._id}`);
  return await newBlog.save();
};
  

export const updateBlogService = async (id, updateData, files) => {
  try {
    const existingBlog = await Blog.findById(id);

    if (!existingBlog) {
      console.error('❌ Blog post not found.');
      throw new Error('Blog post not found.');
    }

    // Initial image URLs from existing blog
    let imageUrls = existingBlog.images || [];

    // ✅ Handle image removal (if requested by user)
    if (updateData.removeImages === true || updateData.removeImages === 'true') {
      
      if (existingBlog.images.length > 0) {
        for (const url of existingBlog.images) {
          await deleteFromCloudinary(url);
        }
      }
      
      imageUrls = []; // Clear image URLs in DB
    }

    // ✅ Handle new images if provided
    if (files && files.length > 0) {
      
      if (updateData.replaceImages === true || updateData.replaceImages === 'true') {
        
        // Delete old images before replacing
        if (existingBlog.images.length > 0) {
          for (const url of existingBlog.images) {
            await deleteFromCloudinary(url);
          }
        }

        // Upload new images and get URLs
        imageUrls = await handleImageUpload(files);
      } else {
        
        // Upload new images and append to the existing ones
        const newUrls = await handleImageUpload(files);
        imageUrls = [...existingBlog.images, ...newUrls];
      }
    }

    // ✅ Prepare updated data (allow partial updates)
    const updatedBlogData = {
      ...(updateData.title && { title: updateData.title }),
      ...(updateData.content && { content: updateData.content }),
      ...(updateData.author && { author: updateData.author }),
      ...(updateData.tags && { tags: updateData.tags }),
      images: imageUrls, // Updated images after handling
    };

    // ✅ Update the blog post in DB
    console.log('📚 Updating blog with new data...');
    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedBlogData, { new: true });

    if (!updatedBlog) {
      console.error('⚠️ Blog update failed.');
      throw new Error('Blog update failed.');
    }

    console.log('✅ Blog updated successfully:', updatedBlog);
    return updatedBlog;
  } catch (error) {
    console.error('❌ Error in updateBlogService:', error.message);
    throw error;
  }
};

// Handle image upload and return URLs
const handleImageUpload = async (files) => {
  const uploadedUrls = [];
  for (const file of files) {
    const localFilePath = file.path;
    const uploadResult = await uploadOnCloudinary(localFilePath);
    
    if (uploadResult) {
      uploadedUrls.push(uploadResult.secure_url);
    } else {
      console.error(`⚠️ Failed to upload image: ${localFilePath}`);
    }
  }
  return uploadedUrls;
};