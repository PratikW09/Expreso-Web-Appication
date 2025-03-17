import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/users/register', userData);
      console.log(response.data)
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

// Thunk to handle user login
export const loginUser = createAsyncThunk(
  'login',
  async (userData, { rejectWithValue }) => {
    try {
      // console.log("hi")
      const response = await axios.post('/api/users/login', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Thunk to handle user logout
export const logoutUser = createAsyncThunk(
  'logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/users/logout');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to handle user freind list
export const fetchFriendList = createAsyncThunk('friendList', async () => {
  const response = await axios.get('/api/users/friends');
  console.log(response.status)
  return response.data;
});


const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('isAuthenticated'),
  friends: [],
}


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    register: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    checkAuthenticate: (state) => {
      const token = localStorage.getItem('accessToken');
      const isUserValid = localStorage.getItem('isUserValid') === 'true';
      const user = JSON.parse(localStorage.getItem('user'));
      console.log(user)

      if (token && isUserValid && user) {
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.token=action.payload.accessToken;

        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.accessToken);
        localStorage.setItem('isAuthenticated', 'true');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.accessToken);
        localStorage.setItem('isAuthenticated', 'true');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFriendList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFriendList.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload.friends;
      })
      .addCase(fetchFriendList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },


});

export const { login, logout, register,checkAuthenticate } = authSlice.actions;

export default authSlice.reducer;
