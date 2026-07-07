import React from 'react';
import { Link } from 'react-router-dom';

function Profile() {
  return (
    <div className="App-content">
      <h2>Your Profile 👤</h2>
      <p>Manage your profile and view your posts</p>
      
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/messages">Messages</Link>
      </div>
      
      <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
        <p>Username: @pivi_user</p>
        <p>Posts: 42</p>
        <p>Followers: 256</p>
      </div>
    </div>
  );
}

export default Profile;