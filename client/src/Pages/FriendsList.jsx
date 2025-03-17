import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFriendList } from '../Reducer/authReducer';

const FriendsList = () => {
  const dispatch = useDispatch();
  const { friends, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchFriendList());
  }, [dispatch]);
  console.log(error)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Friends List</h1>
        <div className="mt-4">
          {friends.length > 0 ? (
            <ul className="space-y-4">
              {friends.map(friend => (
                <li key={friend._id} className="bg-gray-100 shadow-lg rounded-lg p-6 flex justify-between items-center">
                  <div>
                    <p className="text-xl font-semibold text-gray-800">{friend.username}</p>
                    <p className="text-gray-600">{friend.fullName}</p>
                    <p className="text-gray-500">{friend.email}</p>
                  </div>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Unfollow
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No friends found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
