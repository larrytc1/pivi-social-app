import React from 'react';
import '../styles/Messages.css';

function Messages({ userId, userEmail }) {
  const conversations = [
    {
      id: 1,
      username: '@samwilson',
      avatar: 'SW',
      lastMessage: 'Great shot! How did you capture that?',
      timestamp: '2 min ago',
      unread: true
    },
    {
      id: 2,
      username: '@wanderlust',
      avatar: 'WL',
      lastMessage: 'Thanks for the follow!',
      timestamp: '1 hour ago',
      unread: false
    }
  ];

  return (
    <div className="tab-content messages-content">
      <h2>Direct Messages</h2>
      <div className="conversations-list">
        {conversations.map(conv => (
          <div key={conv.id} className={`conversation-item ${conv.unread ? 'unread' : ''}`}>
            <span className="conv-avatar">{conv.avatar}</span>
            <div className="conv-details">
              <span className="conv-username">{conv.username}</span>
              <p className="conv-message">{conv.lastMessage}</p>
            </div>
            <span className="conv-time">{conv.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;