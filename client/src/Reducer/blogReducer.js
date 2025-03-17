import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
  posts: [],
  loading: false,
  error: null,
  success: false,
  userPosts: [],
  singlePost: null,
};

// Create async thunks
export const fetchAllPosts = createAsyncThunk('fetchAllPosts', async () => {
  const response = await axios.get('/api/users/getAllPost');
  return response.data;
});

export const fetchAllUserPosts = createAsyncThunk('fetchAllUserPosts', async () => {
  const response = await axios.get('/api/users/getUserPost');
  return response.data;
});

export const getSinglePost = createAsyncThunk(
  'singlePost',
  async (blogid, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/users/getsinglePost/${blogid}`);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const createPost = createAsyncThunk(
  'createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/users/create', postData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deletePost = createAsyncThunk('blog/deletePost', async (postId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`/api/users/delete/${postId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const likePost = createAsyncThunk('blog/likePost', async (postId, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/api/users/like/${postId}`);
    if (response.status === 201) {
      return { postId };
    }
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updatePost = createAsyncThunk(
  'updatePost',
  async ({ postId, updatedData }, { rejectWithValue }) => {
    try {
      // console.log("i ma update")
      // console.log(postId,updatedData)
      const response = await axios.put(`/api/users/update/${postId}`, updatedData);
      // console.log("update",response.data)
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Create the blog slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllUserPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts = action.payload.posts;
      })
      .addCase(fetchAllUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.posts.push(action.payload); // Assuming the API returns the created post
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(likePost.pending, (state, action) => {
        const postId = action.meta.arg;
        const post = state.posts.find((post) => post._id === postId);
        if (post) {
          post.likeStatus = 'loading';
        }
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find((post) => post._id === postId);
        if (post) {
          post.likeStatus = 'succeeded';
          post.likesCount += 1;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        const postId = action.meta.arg;
        const post = state.posts.find((post) => post._id === postId);
        if (post) {
          post.likeStatus = 'failed';
          post.likeError = action.payload || action.error.message;
        }
      })
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((post) => post._id !== action.payload.blog._id);
        state.userPosts = state.userPosts.filter((post) => post._id !== action.payload.blog._id);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getSinglePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSinglePost.fulfilled, (state, action) => {
        state.loading = false;
        state.singlePost = action.payload.blog;
      })
      .addCase(getSinglePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.posts.findIndex(post => post._id === action.payload.blog._id);
        if (index !== -1) {
          state.posts[index] = action.payload.blog;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default blogSlice.reducer;
