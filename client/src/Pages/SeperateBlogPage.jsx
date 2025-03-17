import React from 'react';
import axios from 'axios';

const SeperateBlogPage = ({ postId }) => {
  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/posts/${postId}/like`);
      if (response.status === 201) {
        // Handle like success, update UI if needed
        console.log('Post liked successfully');
      }
    } catch (error) {
      console.error('Error liking the post:', error);
      // Handle error, show error message to user
    }
  };

  const handleConnect = async () => {
    try {
      const response = await axios.post(`/api/posts/${postId}/connect`);
      if (response.status === 201) {
        // Handle connect success, update UI if needed
        console.log('Connected successfully');
      }
    } catch (error) {
      console.error('Error connecting:', error);
      // Handle error, show error message to user
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md border-black border-2 rounded-lg overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-gray-900">Full Title</h1>
        <div className="flex items-center mt-4">
          <p className="text-sm text-gray-600">By kick</p>
          <span className="mx-2 text-gray-400">|</span>
          <p className="text-sm text-gray-600">22-5/24</p>
        </div>
        <div className="mt-4">
          <button 
            onClick={handleLike}
            className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-700 mr-2"
          >
            Like
          </button>
          <button 
            onClick={handleConnect}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Connect
          </button>
        </div>
        <div className="mt-6 text-gray-700 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. ...
        </div>
      </div>
    </div>
  );
};

export default SeperateBlogPage;
