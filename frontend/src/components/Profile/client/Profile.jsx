import React, { useEffect } from 'react';
import './Profile.css'; // Import CSS file for styling
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../features/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserProfile() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      console.log("Found stored user data:", JSON.parse(storedUser).user.uuid);
    } else {
      console.log("No stored user found, logging out");
      dispatch(logoutUser());
    }
  }, [dispatch, navigate]);

  const deleteUser = async (uuid) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/edit/${uuid}`);
      dispatch(logoutUser()); // Log out the user after deletion
      navigate('/'); // Redirect to home or login page
    } catch (error) {
      console.error("There was an error deleting the user!", error);
    }
  };

  if (isLoading) {
    return <div className="profile-container">Loading profile data...</div>;
  }

  if (!user || !user.user) {
    return <div className="profile-container">No user data available</div>;
  }

   // Generate random colors
   const randomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const backgroundColor = randomColor();
  const textColor = randomColor();

  // Construct avatar URL with random colors
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user.name)}&background=${backgroundColor}&color=${textColor}`;

  return (
    <div className="profile-container client-container">
      <div className="profile-header">
        {user.user.name ? (
          <img src={avatarUrl} alt="Avatar" className="avatar" />
        ) : (
          <div className="avatar-placeholder">No Avatar</div>
        )}
        <h2>Welcome, {user.user.name || 'User'}!</h2>
      </div>
      <div className="profile-details">
        <p><strong>Email:</strong> {user.user.email || 'Not Available'}</p>
        <p><strong>Role:</strong> {user.user.role || 'Not Available'}</p>
        <p><strong>Address:</strong> {user.user.address || 'Not Available'}</p>
        <p><strong>Phone Number:</strong> {user.user.phoneNumber || 'Not Available'}</p>
        {user.user.about && (
          <div className="about-section">
            <h3>About</h3>
            <p>{user.user.about}</p>
          </div>
        )}
      </div>
      <div className="profile-links">
        <button onClick={() => deleteUser(user.user.uuid)} className="link-danger">
          Delete User
        </button>
        <button onClick={() => navigate(`/user/edit/${user.user.uuid}`)} className="link-info">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
