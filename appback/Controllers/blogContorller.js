import Blog from '../Models/blogmodels.js';
import Like from '../Models/likemodels.js';
import { createBlogService, updateBlogService } from '../Services/blogService.js';
import { decodeToken } from '../Utils/authutils.js';
import { Response,errorResponse } from '../Utils/responseHandler.js';

import fs from 'fs';
import { uploadOnCloudinary } from '../Utils/fileupload.js';



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


  
  
 export const createBlog = async (req, res, next) => {
  const { title, content, author, tags } = req.body;

  const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

  // Check if token is provided
  if (!accessToken) {
    console.error('❌ No token found. Authorization failed.');
    return errorResponse(res, 400, 'Token not found in create blog post controller.');
  }

  // Basic validation for required fields
  if (!title || !content) {
    console.error('❌ Missing required fields.');
    return errorResponse(res, 400, 'Please fill in all fields.');
  }

  try {
    // Decode token to get userId
    const userId = await decodeToken(accessToken);

    // Upload images to Cloudinary if any
    const imageUrls = [];
    if (req.files && req.files.length > 0) {

      for (const file of req.files) {
        const localFilePath = file.path;

        const uploadResult = await uploadOnCloudinary(localFilePath);

        if (uploadResult) {
          imageUrls.push(uploadResult.secure_url);
        } else {
          console.error(`⚠️ Upload failed for file: ${localFilePath}`);
        }
      }
    } else {
      console.log('ℹ️ No images provided for this blog post.');
    }

    // Create the new blog post with image URLs
    const newBlog = await createBlogService({
      userId,
      title,
      content,
      author,
      tags,
      images: imageUrls, // Store uploaded image URLs in DB
    });

    // Return success response
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
      const blog = await Blog.findById(blogId);
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