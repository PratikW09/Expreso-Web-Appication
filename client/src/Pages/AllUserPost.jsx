import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUserPosts } from '../Reducer/blogReducer.js';
import BlogCard from '../components/BlogCard.jsx'; // Import the BlogCard component

const AllUserPosts = () => {
  const dispatch = useDispatch();
  const { userPosts, loading, error } = useSelector((state) => state.blog);
  

  useEffect(() => {
    
      dispatch(fetchAllUserPosts());
    
  },[dispatch]);


  
  if (loading) {
    return <div>Loading...</div>;
  }

  // if(error){
  //   return <h1>Error from all user post page</h1>
  // }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900">All Posts</h1>
        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
          {userPosts.length > 0 ? (
            userPosts.map(post => <BlogCard key={post._id} post={post} />)
          ) : (
            <p className="text-gray-700">No posts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUserPosts;
