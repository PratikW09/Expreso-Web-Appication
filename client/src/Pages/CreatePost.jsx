import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../Reducer/blogReducer';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const blog = useSelector((state) => state.blog.singlePost);
  const {loading,success,error} = useSelector((state) => state.blog);

  // setAuthor(user.username);
  // console.log("update",blog)

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const tagsArray = tags.split(',').map((tag) => tag.trim());
    const postData ={title,content,author:user.username,tags:tagsArray}
    dispatch(createPost(postData));
  
  };
  // if(error){
  //   return <h1>error</h1>
  // }

  // if(success){
  //   return<h1>created post successfully</h1>
  // }
  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer autoClose={500} />
      <h1 className="text-3xl font-bold text-center mb-8">Create New Post</h1>
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
                           {loading ? 'Creating ...' : success ? 'Post Create successfully' : 'Create Post'}

          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
