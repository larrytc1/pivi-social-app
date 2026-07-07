import React from 'react';
import '../styles/Settings.css';

function Settings({ userId, userEmail, onLogout }) {
  const handleSettingChange = (setting) => {
    console.log('⚙️ SETTING_CHANGED', { setting, userId });
  };

  return (
    <div className="tab-content settings-content">
      <h2>Settings</h2>
      <div className="settings-list">
        <div className="setting-item">
          <div className="setting-info">
            <h3>Account Email</h3>
            <p>{userEmail}</p>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h3>Notifications</h3>
            <p>Manage your notification preferences</p>
          </div>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h3>Privacy</h3>
            <p>Control who can see your profile</p>
          </div>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h3>Dark Mode</h3>
            <p>Enable dark theme</p>
          </div>
          <input type="checkbox" />
        </div>

        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Settings;