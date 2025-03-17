import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../Reducer/authReducer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { pendingRequests } = useSelector((state) => state.friendRequest);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logoutUser());
  };

  return (
    <>
      <nav className="bg-gray-900 shadow-md w-full px-6 border-b border-gray-700">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-white">
                THE BLOG
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="text-sm font-medium text-gray-300 hover:text-white">
                    Profile
                  </Link>
                  <Link to="/create" className="text-sm font-medium text-gray-300 hover:text-white">
                    Create Blog
                  </Link>
                  <Link to="/friend-req" className="text-sm font-medium text-gray-300 hover:text-white">
                    {`(${pendingRequests?.length}) Friend Requests`}
                  </Link>
                  <Link to="/chat" className="text-sm font-medium text-gray-300 hover:text-white">
                    Chats
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/register" className="text-sm font-medium text-gray-300 hover:text-white">
                    Register
                  </Link>
                  <Link to="/loginusername" className="text-sm font-medium text-gray-300 hover:text-white">
                    Login
                  </Link>
                </>
              )}
            </div>
            <div className="flex md:hidden items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="block text-base font-medium text-gray-300 hover:text-white">
                    Profile
                  </Link>
                  <Link to="/create" className="block text-base font-medium text-gray-300 hover:text-white">
                    Create Blog
                  </Link>
                  <Link to="/friend-req" className="block text-base font-medium text-gray-300 hover:text-white">
                    {`(${pendingRequests?.length}) Friend Requests`}
                  </Link>
                  <Link to="/chat" className="block text-base font-medium text-gray-300 hover:text-white">
                    Chats
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-base font-medium text-gray-300 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/register" className="block text-base font-medium text-gray-300 hover:text-white">
                    Register
                  </Link>
                  <Link to="/loginusername" className="block text-base font-medium text-gray-300 hover:text-white">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <ToastContainer />
    </>
  );
};

export default Navbar;
