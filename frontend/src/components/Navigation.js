import React from 'react';
import '../styles/Navigation.css';

function Navigation({ activeTab, onTabChange, userEmail, onLogout }) {
  const tabs = [
    { id: 'pictures', label: 'Pictures', icon: '🖼️' },
    { id: 'videos', label: 'Videos', icon: '🎬' },
    { id: 'tags', label: 'Tags', icon: '🏷️' },
    { id: 'messages', label: 'DMs', icon: '💌' },
    { id: 'upload', label: 'Upload', icon: '📤' },
    { id: 'settings', label: 'Settings', icon: '🔧' },
    { id: 'profile', label: 'Profile', icon: '👥' }
  ];

  return (
    <>
      <nav className="desktop-nav">
        <div className="nav-header">PiVi</div>
        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              title={tab.label}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="nav-user">
          <span className="user-email">{userEmail}</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div className="mobile-nav">
        <div className="mobile-header">
          <h1>PiVi</h1>
        </div>
        <div className="mobile-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`mobile-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              title={tab.label}
            >
              {tab.icon}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default Navigation;