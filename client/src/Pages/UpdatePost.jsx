import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '../Reducer/blogReducer';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdatePost = () => {
  const { singlePost, loading, error } = useSelector((state) => state.blog);
  const [title, setTitle] = useState(singlePost?.title || '');
  const [content, setContent] = useState(singlePost?.content || '');
  const [tags, setTags] = useState(singlePost?.tags ? singlePost.tags.join(', ') : '');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
// console.log(singlePost)
  // useEffect(() => {
  //   if (singlePost) {
  //     setTitle(singlePost.title || '');
  //     setContent(singlePost.content || '');
  //     setTags(singlePost.tags ? singlePost.tags.join(', ') : '');
  //   }
  // }, [singlePost]);

  if (loading) {
    return <h1>Getting post details...</h1>;
  }
  
  if (error) {
    return <h1>{error.message}</h1>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const tagsArray = tags.split(',').map((tag) => tag.trim());
    const postData = { title, content, author: user.username, tags: tagsArray };
    dispatch(updatePost({ postId: singlePost._id, updatedData: postData }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer autoClose={5000} />
      <h1 className="text-3xl font-bold text-center mb-8">Update Post</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-gray shadow-md p-6 rounded-lg text-white">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-bold text-gray-100 mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow-sm focus:outline-none focus:shadow-outline"
            placeholder="Enter title"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="block text-sm font-bold text-gray-700 mb-2">
            Author (Automatically filled)
          </label>
          <input
            id="author"
            type="text"
            value={user.username}
            readOnly
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow-sm bg-gray-200 focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="tags" className="block text-sm font-bold text-gray-700 mb-2">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow-sm focus:outline-none focus:shadow-outline"
            placeholder="e.g., technology, programming"
          />
        </div>
        <div className="mb-6 text-gray-900 border-2 border-black">
          <label htmlFor="content" className="block text-sm font-bold text-gray-700 mb-2">
            Content
          </label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="bg-gray-400 border-4 border-black rounded-lg h-64"
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 mt-4"
            disabled={loading}
          >
            {loading ? 'Updating ...' : 'Update Post'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default UpdatePost;
