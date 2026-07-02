import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo">
          <h1>📸 PiVi</h1>
        </div>
        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate('/home')} className="nav-btn">Home</button>
              <button onClick={() => navigate('/profile')} className="nav-btn">Profile</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="nav-btn nav-login">Login</button>
              <button onClick={() => navigate('/signup')} className="nav-btn nav-signup">Sign Up</button>
            </>
          )}
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2>Share Your Moments</h2>
          <p>Upload pictures and videos to share with your community</p>
          <button onClick={handleGetStarted} className="cta-btn">
            {isAuthenticated ? '🏠 Go to Home' : '🚀 Get Started'}
          </button>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">📹 📸</div>
        </div>
      </section>

      <section className="features">
        <h3>Why PiVi?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📸</div>
            <h4>Share Photos</h4>
            <p>Upload and share your favorite photos with your community</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎬</div>
            <h4>Share Videos</h4>
            <p>Record and upload videos to showcase your moments</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">❤️</div>
            <h4>Like & Comment</h4>
            <p>Engage with posts through likes and comments</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h4>Your Profile</h4>
            <p>Customize your profile and view all your posts</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2024 PiVi Social App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
