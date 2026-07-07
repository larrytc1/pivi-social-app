import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="App-content">
      <h2>Welcome to Pivi 📸</h2>
      <p>A vibrant social platform for sharing stories through pictures, videos, and real-time messaging</p>
      
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/messages">Messages</Link>
      </div>
      
      <p style={{ marginTop: '40px', fontSize: '1.2em' }}>
        Share your moments, connect with friends, and explore amazing stories! 🚀
      </p>
    </div>
  );
}

export default Home;