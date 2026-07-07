import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/Profile.css';

function Profile({ userId, userEmail, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('🚪 LOGOUT_FROM_PROFILE', { userId, email: userEmail });
    onLogout();
    navigate('/login');
  };

  return (
    <div className="feed-container">
      <Navigation 
        activeTab="profile" 
        onTabChange={() => {}}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
      <div className="feed-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">👤</div>
            <h2>Your Profile</h2>
          </div>
          <div className="profile-details">
            <p><strong>Email:</strong> {userEmail}</p>
            <p><strong>User ID:</strong> {userId}</p>
            <p><strong>Posts:</strong> 0</p>
            <p><strong>Followers:</strong> 0</p>
            <p><strong>Joined:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;