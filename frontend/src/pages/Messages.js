import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/Messages.css';

function Messages({ userId, userEmail, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="feed-container">
      <Navigation 
        activeTab="messages" 
        onTabChange={() => {}}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
      <div className="feed-content">
        <div className="messages-card">
          <h2>💬 Direct Messages</h2>
          <p>You have no messages yet</p>
          <p className="messages-hint">Start a conversation by messaging other users!</p>
        </div>
      </div>
    </div>
  );
}

export default Messages;