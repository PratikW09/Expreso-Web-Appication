import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../Reducer/authReducer.js'
import blogReducer from '../Reducer/blogReducer.js';
import likeReducer from '../Reducer/likeReducer.js';
import friendRequestReducer from '../Reducer/friendRequestReducer.js';

export const store = configureStore({
  reducer: {
    auth:authReducer,
    blog:blogReducer,
    like:likeReducer,
    friendRequest:friendRequestReducer,
  },
})