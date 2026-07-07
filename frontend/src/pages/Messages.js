import React from 'react';
import { Link } from 'react-router-dom';

function Messages() {
  return (
    <div className="App-content">
      <h2>Messages 💬</h2>
      <p>Connect with your friends in real-time</p>
      
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/messages">Messages</Link>
      </div>
      
      <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
        <p>You have no new messages</p>
      </div>
    </div>
  );
}

export default Messages;