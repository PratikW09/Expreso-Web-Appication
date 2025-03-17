import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LnadingPage from './Pages/LnadingPage.jsx';
import SeperateBlogPage from './Pages/SeperateBlogPage.jsx';
import CreatePost from './Pages/CreatePost.jsx';
import Navbar from './components/Navbar.jsx';
import RegisterPage from './Pages/RegisterPage.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import LoginPageEmail from './Pages/LoginPageEmail.jsx';
import Profile from './Pages/ProfilePage.jsx';
import FriendRequests from './Pages/FriendsReqeust.jsx';
import FriendsList from './Pages/FriendsList.jsx';
import AllUserPosts from './Pages/AllUserPost.jsx';
import { likeArray } from './Reducer/likeReducer';
import UpdatePost from './Pages/UpdatePost.jsx';
import { fetchFriendRequests } from '../src/Reducer/friendRequestReducer.js';


function App() {
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector(state => state.auth);
  

  useEffect(() => {
    if(isAuthenticated){
      dispatch(fetchFriendRequests());
      dispatch(likeArray())

    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col  items-center justify-center bg-white  text-black dark:text-white dark:bg-black">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LnadingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/loginusername" element={<LoginPage />} />
          <Route path="/loginemail" element={<LoginPageEmail />} />
          {isAuthenticated ? (
            <>
              <Route path="/SeperateBlogPage" element={<SeperateBlogPage />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/update" element={<UpdatePost />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/friend-req" element={<FriendRequests />} />
              <Route path="/friends" element={<FriendsList />} />
              <Route path="/all-posts" element={<AllUserPosts />} />
              
            </>
          ) : (
            <Route path="/loginusername" element={<LoginPage />} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
