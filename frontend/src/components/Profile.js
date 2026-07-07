import React from 'react';
import '../styles/Profile.css';

function Profile({ userId, userEmail, onLogout }) {
  return (
    <div className="tab-content profile-content">
      <div className="profile-header">
        <div className="profile-avatar">PROFILE</div>
        <div className="profile-info">
          <h2>Your Profile</h2>
          <p className="profile-email">{userEmail}</p>
          <p className="profile-id">ID: {userId}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat">
          <span className="stat-label">Posts</span>
          <span className="stat-value">0</span>
        </div>
        <div className="stat">
          <span className="stat-label">Followers</span>
          <span className="stat-value">0</span>
        </div>
        <div className="stat">
          <span className="stat-label">Following</span>
          <span className="stat-value">0</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="edit-btn">Edit Profile</button>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;