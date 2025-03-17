import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../Reducer/authReducer';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error,isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username|| !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    const userData = { emailOrUsername:username, password };
    console.log("h i am login")
    dispatch(loginUser(userData));
  };

  // if(error){
  //   return <h1>Error {error}</h1>
  // }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer autoClose={1000} /> {/* Auto close toast after 3000ms */}
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-900">Login with Username</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
          <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
               {loading ? 'Login ...' : isAuthenticated ? 'Login successfully' : 'Login'}
            
              
            </button>
          </div>
        </form>
        <div className="text-center text-sm">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
