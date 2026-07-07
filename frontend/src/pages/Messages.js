import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/Messages.css';

function Messages({ userEmail, onLogout }) {
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
          <h2>Direct Messages</h2>
          <p>You have no messages</p>
        </div>
      </div>
    </div>
  );
}

export default Messages;