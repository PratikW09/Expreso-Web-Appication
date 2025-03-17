import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// Define the initial state
const initialState = {
    likes: [],
    loading: false,
    error: null,
    success:false,
  };


  export const likeArray = createAsyncThunk('likeArrat', async () => {
    const response = await axios.get('/api/users/getAllLikes');
    return response.data;
  });

  const likeSlice = createSlice({
    name: 'like',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
      .addCase(likeArray.pending, (state) => {
        state.loading = true;
      })
      .addCase(likeArray.fulfilled, (state, action) => {
        state.loading = false;
        state.likes = action.payload.likes;
      })
      .addCase(likeArray.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  
    },
  });
  
  export default likeSlice.reducer;