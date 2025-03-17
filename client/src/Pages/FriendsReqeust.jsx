import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFriendRequests, acceptFriendRequest, rejectFriendRequest } from '../Reducer/friendRequestReducer';

const FriendRequests = () => {
  const dispatch = useDispatch();
  const { pendingRequests, loading, error } = useSelector((state) => state.friendRequest);

  const handleAccept = (requestId) => {
    dispatch(acceptFriendRequest(requestId)).then((action) => {
      if (acceptFriendRequest.fulfilled.match(action)) {
        toast.success('Friend request accepted successfully!');
      } else {
        toast.error('Error accepting friend request. Please try again later.');
      }
    });
  };

  const handleReject = (requestId) => {
    dispatch(rejectFriendRequest(requestId)).then((action) => {
      if (rejectFriendRequest.fulfilled.match(action)) {
        toast.success('Friend request rejected successfully!');
      } else {
        toast.error('Error rejecting friend request. Please try again later.');
      }
    });
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4">Error fetching friend requests. Please try again later.</div>;
  }

  if (pendingRequests.length === 0) {
    return <div className="text-center py-4">No friend requests found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Friend Requests</h1>
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        {pendingRequests.map((request) => (
          <div key={request._id} className="mb-4 p-4 bg-gray-100 rounded-lg flex justify-between items-center">
            <p className="text-gray-700">
              <span className="font-bold">{request.sender.username}</span> ({request.sender.email})
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleAccept(request._id)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(request._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;
