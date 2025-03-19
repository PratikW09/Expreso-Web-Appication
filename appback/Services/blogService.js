import Blog from "../Models/blogmodels.js";

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
  