import React, { useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation (optional, add checks for empty fields)
    if (!username || !password) {
      console.log('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('/api/users/login', {
        emailOrUsername: email, // Send username only
        password,
      });

      const data = response.data;

      if (data) {
        console.log('Login successful!', data.message);
        // Handle successful login (e.g., redirect to another page)
      }
    } catch (error) {
      console.error('Error in login:', error);
      // Handle login error (e.g., display error message)
    }
  };

  // ... rest of the code for handleTabClick and renderTabContent (modified) ...

  return (
    <div className="container mx-auto px-4 py-8 border-5">
        <Link to="/loginemail" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                username
              </Link>
        <Link to="/loginusername" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Email
              </Link>

      <h1 className="text-2xl font-bold text-center mb-4">Login with Email</h1>

     

      <div className="tab-content">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-4"
        />
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <form onSubmit={handleSubmit}>
        <button type="submit" className="block w-full px-3 py-2 rounded-md bg-indigo-500 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50 mt-4">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
