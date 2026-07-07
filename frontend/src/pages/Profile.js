import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/Profile.css';

function Profile({ userEmail, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
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
          <h2>Your Profile</h2>
          <p>Email: {userEmail}</p>
          <p>Posts: 0</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;