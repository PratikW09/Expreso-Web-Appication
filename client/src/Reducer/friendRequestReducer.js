// src/store/friendRequestSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch friend requests
export const fetchFriendRequests = createAsyncThunk(
  'friendRequest/fetchFriendRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/users/friend-req');
      return response.data.requests;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Accept friend request
export const acceptFriendRequest = createAsyncThunk(
  'friendRequest/acceptFriendRequest',
  async (requestId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`/api/users/accept/${requestId}`);
      if (response.status === 200) {
        dispatch(fetchFriendRequests());
        return requestId;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Reject friend request
export const rejectFriendRequest = createAsyncThunk(
  'friendRequest/rejectFriendRequest',
  async (requestId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`/api/users/reject/${requestId}`);
      if (response.status === 200) {
        dispatch(fetchFriendRequests());
        return requestId;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const friendRequestSlice = createSlice({
  name: 'friendRequest',
  initialState: {
    pendingRequests: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Add reducers if you need to handle synchronous actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = action.payload;
      })
      .addCase(fetchFriendRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.pendingRequests = state.pendingRequests.filter(request => request._id !== action.payload);
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.pendingRequests = state.pendingRequests.filter(request => request._id !== action.payload);
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default friendRequestSlice.reducer;
