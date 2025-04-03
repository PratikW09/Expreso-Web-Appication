import React from 'react';

const PostForm = ({ post, handleInputChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        name="title"
        value={post.title}
        onChange={handleInputChange}
        placeholder="Enter your title"
        className="w-full p-2 rounded bg-gray-900 text-white"
      />

      <input
        type="text"
        name="author"
        value={post.author}
        onChange={handleInputChange}
        placeholder="Enter author name"
        className="w-full p-2 rounded bg-gray-900 text-white"
      />

      <input
        type="text"
        name="tags"
        value={post.tags}
        onChange={handleInputChange}
        placeholder="Add tags (comma-separated)"
        className="w-full p-2 rounded bg-gray-900 text-white"
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        Create Post
      </button>
    </form>
  );
};

export default PostForm;