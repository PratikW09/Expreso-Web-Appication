import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllPosts } from '../Reducer/blogReducer';
import BlogCard from '../components/BlogCard';
const LandingPage = () => {
  
  const {posts,loading ,error} = useSelector((state) => state.blog);
 
  const dispatch = useDispatch();
  
  useEffect(() => {
      
      dispatch(fetchAllPosts());
      
  }, [ dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (posts.length === 0) {
    return <div>No posts available</div>;
  }

  return (
    <div>
      <h1>Landing page</h1>
      {posts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default LandingPage;
