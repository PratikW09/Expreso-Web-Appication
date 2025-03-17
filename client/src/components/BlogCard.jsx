import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, deletePost, getSinglePost } from '../Reducer/blogReducer';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const stripHtmlTags = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

const BlogCard = ({ post }) => {
  const navigate = useNavigate();
  const [showFullContent, setShowFullContent] = useState(false);
  const dispatch = useDispatch();
  // const userId = useSelector((state) => state.auth.user._id); // Assuming you have the user ID in the state
  const { singlePost, loading } = useSelector((state) => state.blog);
  const { likes } = useSelector((state) => state.like);
  const { user } = useSelector((state) => state.auth);

  // Find the post by its ID in the Redux store
  const postState = useSelector((state) => state.blog.posts[post._id]) || {};
  const { likeStatus, likeError, likesCount = post.likesCount } = postState;

  const hasLiked = likes.some((like) => like.userId === user?._id && like?.blogId === post._id);
  const isAuthor = user?.username === post.author;

  useEffect(() => {
    if (likeStatus === 'failed' && likeError) {
      toast.error(`Error liking the post: ${likeError}`);
    }
  }, [likeStatus, likeError]);

  const handleLike = () => {
    if (hasLiked) {
      toast.warning('You have already liked this post');
      return;
    }

    dispatch(likePost(post._id));
  };

  const handleReadMore = () => {
    setShowFullContent(true);
  };

  const handleEdit = () => {
    dispatch(getSinglePost(post._id));
    if (loading === false && singlePost) {
      navigate('/update');
    }
  };

  const handleDelete = () => {
    dispatch(deletePost(post._id));
  };

  const handleFollow = async (authorId) => {
    try {
      console.log("handle follow")
      const response = await axios.post(`/api/users/connect/${authorId}`);
      console.log(response.data);
      if (response.status === 200) {
        toast.success('User followed successfully!');
        console.log('Followed user', authorId);
      }
    } catch (error) {
      console.error('Error following user:', error.message);
      toast.error('Error following user. Please try again later.');
    }
  };

  const contentText = stripHtmlTags(post.content);
  const truncatedContent = contentText.split(' ').slice(0, 30).join(' ');

  return (
    <div className="max-w-2xl mx- overflow-hidden  bg-gray-950 shadow-md rounded-lg my-4 p-6 transition transform hover:scale-105 hover:shadow-lg">
      <div className="flex items-center mb-4 cursor-pointer">
              <img
                src={post.authorAvatarUrl}
                alt={post.author}
                className="w-12 h-12 rounded-full mr-4"
              />
        <div>
                <div className="text-white font-semibold">{post.author}</div>
                <div className="text-gray-400 text-sm">Created at: {new Date(post.createdAt).toLocaleDateString()}</div>
        </div>
        <div className="flex justify-between items-center mx-8">
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${hasLiked ? 'bg-red-500 text-white cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-800'}`}
          disabled={hasLiked || likeStatus === 'loading'}
        >
          {hasLiked ? 'Liked' : 'Like'}
        </button>
        <span className="ml-2 text-gray-400">{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
      </div>
      </div>
      <div className="text-xl text-white font-bold mb-2">
        {post.title}
      </div>
      <p className="text-gray-300 mb-4">
        {showFullContent ? contentText : `${truncatedContent}...`}
        {!showFullContent && (
          <button
            onClick={handleReadMore}
            className="text-indigo-400 font-medium focus:outline-none hover:text-indigo-600 ml-2"
          >
            Read More
          </button>
        )}
      </p>
      
      {isAuthor && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleEdit}
            className="px-4 py-2 rounded-md text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
      <button
        onClick={() => handleFollow(post.user_id)}
        className="px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 mt-4 mx-0"
      >
        Follow
      </button>
      {likeStatus === 'failed' && <p className="text-red-500">{likeError}</p>}
    </div>
  );
};

export default BlogCard;
