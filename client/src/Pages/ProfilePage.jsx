import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Profile = () => {
  
  const navigate = useNavigate();
  const {user,loading} = useSelector((state) => state.auth);

  // useEffect(() => {
  //   const fetchUserPosts = async () => {
  //     try {
  //       const postsResponse = await axios.get('/api/users/getUserPost');
  //       setPosts(postsResponse.data.posts);
  //     } catch (error) {
  //       console.error('Error fetching posts:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserPosts();
  // }, []);

  const handleViewAllFriends = () => {
    navigate('/friends');
  };

  const handleViewAllPosts = () => {
    navigate('/all-posts');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">Profile Page</h1>
        <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col items-center">
              <img
                className="h-24 w-24 rounded-full object-cover mb-4"
                src={`https://avatars.dicebear.com/api/initials/${user.username}.svg`}
                alt={user.username}
              />
              <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
              <p className="text-gray-700">{user.email}</p>
            </div>
            <div className="mt-4 text-center">
              <div className="mb-2 text-gray-900">
                <strong className="text-gray-900">Full Name:</strong> {user?.fullName}
              </div>
              <div  className="mb-2 text-gray-900">
                <strong className="text-gray-700">Contact:</strong> {user?.contact}
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={handleViewAllFriends}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 border border-blue-700"
              >
                View All Friends
              </button>
              <button
                onClick={handleViewAllPosts}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 border border-green-700"
              >
                View All Posts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
