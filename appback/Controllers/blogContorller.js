import Blog from '../Models/blogmodels.js';
import Like from '../Models/likemodels.js';
import { createBlogService, updateBlogService,deleteBlogService } from '../Services/blogService.js';
import { decodeToken } from '../Utils/authutils.js';
import { Response,errorResponse } from '../Utils/responseHandler.js';

import fs from 'fs';
import { uploadOnCloudinary } from '../Utils/fileupload.js';
import { handleImageUploadsV1 } from '../Utils/helperUploadImagesAsync.js';



const likeBlog = async (req, res) => {
    const blogid = req.params.blogid; // Assuming the blog ID is passed in the URL parameters
    // console.log(blogid);
  
    try {
      // Retrieve the user ID from the cookies
      const userId = await decodeToken(req.cookies.accessToken);
  console.log(userId)
      // Check if the blog post exists
      const blog = await Blog.findById(blogid);
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      // Check if the user has already liked the blog post
      const existingLike = await Like.findOne({blogId: blogid, userId: userId });
      if (existingLike) {
        console.log("You have already liked this blog post")
        return res.status(400).json({ message: 'You have already liked this blog post' });
      }
  
      // Create a new like
      const newLike = new Like({blogId: blogid,  userId:userId });
    //   console.log(newLike);
  
      // Save the like to the database
      await newLike.save();
    //   console.log(1);
  
      // Increment the likes count in the blog post
      blog.likesCount = (blog.likesCount || 0) + 1;
    //   console.log(2);
      await blog.save();
    //   console.log("hii", blog);
      // console.log("likes",)
      res.status(201).json({ message: 'Blog post liked successfully', like: newLike, blog });
    } catch (error) {
      console.error("Error liking the blog post:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  const getAllLikes = async (req, res) => {
    try {
      // Fetch all likes from the database
      const likes = await Like.find();
  
      // Return the likes array
      res.status(201).json({ message: 'All likes array', likes: likes });
    } catch (error) {
      console.error("Error fetching likes:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


  export const uploadImage = async (req, res, next) => {
    try {
      console.log('📥 Received an image upload request.');
  
      // Check if a file was uploaded
      if (!req.file) {
        console.warn('⚠️ No image provided for upload.');
        return res.status(400).json({ message: 'No image provided. Please upload an image.' });
      }
  
      console.log('🔄 Processing image upload...');
  
      // Upload image to Cloudinary
      const cloudinaryImageUrl = await handleImageUploadsV1(req.file);
  
      if (!cloudinaryImageUrl) {
        console.error('❌ Image upload failed. No URL received from Cloudinary.');
        return res.status(500).json({ message: 'Image upload failed. Please try again later.' });
      }
  
      console.log('✅ Image uploaded successfully:', cloudinaryImageUrl);
  
      return Response(res, 200, 'Image uploaded successfully', {url: cloudinaryImageUrl})
      
      
  
    } catch (error) {
      console.error('❌ Error occurred while uploading the image:', error);
      next(error); // Pass error to Express error handler
    }
};


  

  
 export const createBlog = async (req, res, next) => {
  const { title, content, author, tags } = req.body;

  const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return errorResponse(res, 400, 'Token not found in create blog post controller.');
  }

  if (!title || !content) {
    return errorResponse(res, 400, 'Please fill in all fields.');
  }

  try {
    const userId = await decodeToken(accessToken);

    const newBlog = await createBlogService({
      userId,
      title,
      content,
      author,
      tags,
      images: [], 
      status:'pending_images'
    });

    if (req.files && req.files.length > 0) {
      handleImageUploads(req.files,newBlog._id, newBlog.userId); 
    } else {
      console.log('ℹ️ No images provided for this blog post.');
    }

    return Response(res, 201, 'Blog post created successfully', {
      blog: newBlog,
    });
  } catch (error) {
    console.error('❌ Error occurred while creating the blog:', error.message);
    next(error);
  }
};


export const updateBlog = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Call the service to update the blog
    const updatedBlog = await updateBlogService(id, updateData, req.files);

    // Return success response
    return Response(res, 200, 'Blog post updated successfully', {
      blog: updatedBlog,
    });
  } catch (error) {
    console.error('❌ Error while updating the blog:', error.message);
    next(error);
  }
};
 


export const deleteBlog = async (req,res) => {
  const {id} = req.params;

  try {
    const result = await deleteBlogService(id);

    return Response(res,200,result)
  } catch (error) {
    console.error('❌ Error in deleteBlogController:', error.message)
    res.status(500).json({error:error.message});
  }
}

  const getPostById = async (req, res) => {
    const blogId = req.params.blogid; // Assuming the blog ID is passed in the URL parameters
  
    try {
      // Find the blog post by ID
      const blog = await Blog.findById({_id:blogId});
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      // Respond with the blog post
      res.status(200).json({ blog });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  

  const getUserPosts = async (req, res) => {
    try {
      // console.log("Fetching user posts...");
  
      // Decode the token to get user ID
      const userId = await decodeToken(req.cookies.accessToken);
      // console.log("User ID from token:", userId);
  
      if (!userId) {
        return res.status(401).json({ message: 'Invalid token or user not authenticated' });
      }
  
      // Find posts by the user ID
      const posts = await Blog.find({ user_id: userId }).sort({ createdAt: -1 });
      // console.log("Posts found:", posts);
  
      if (!posts || posts.length === 0) {
        return res.status(404).json({ message: 'No posts found for this user' });
      }
  
      res.status(200).json({ posts });
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


  const getAllPosts = async (req, res) => {
    try {
      const posts = await Blog.find().sort({ createdAt: -1 }); // Sort by creation date, descending
      res.status(200).json({ posts });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  export {getAllLikes,likeBlog,getUserPosts,getAllPosts,getPostById
    
};