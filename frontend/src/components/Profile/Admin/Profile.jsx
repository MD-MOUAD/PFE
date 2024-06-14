import React, { useEffect, useState } from 'react';
import './Profile.css'; // Import CSS file for styling
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../features/authSlice';
import { useNavigate } from 'react-router-dom';

function AdminProfile() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUsers(storedUser.user);
      console.log("Found stored user data:", storedUser);
    } else {
      console.log("No stored user found, logging out");
      dispatch(logoutUser());
    }
  }, [dispatch, navigate]);

  if (isLoading) {
    return <div className="profile-container">Loading profile data...</div>;
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
  const avatarUrl = users ? `https://ui-avatars.com/api/?name=${encodeURIComponent(users.name)}&background=${backgroundColor}&color=${textColor}` : '';

  if (!user || !user.user) {
    return <div className="profile-container">No user data available</div>;
  }

  return (
    <div className="profile-container admin-profile">
      <div className="profile-header">
        {user.user.name ? (
          <img src={avatarUrl} alt="Avatar" className="avatar" />
        ) : (
          <div className="avatar-placeholder">No Avatar</div>
        )}
        <h2>Welcome, {users ? users.name || 'Admin' : 'Admin'}!</h2>
      </div>
      <div className="profile-details">
        <p><strong>Email:</strong> {users ? users.email || 'Not Available' : 'Not Available'}</p>
        <p><strong>Role:</strong> {users ? users.role || 'Not Available' : 'Not Available'}</p>
        {users && users.about && (
          <div className="about-section">
            <h3>About</h3>
            <p>{users.about}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProfile;
