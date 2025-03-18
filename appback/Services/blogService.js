import Blog from "../Models/blogmodels.js";

export const createBlogService = async (data) => {
    const { userId, title, content, author, tags } = data;
  
    const newBlog = new Blog({
      user_id: userId,
      title,
      content,
      author,
      tags,
    });
  
    return await newBlog.save();
  };
  