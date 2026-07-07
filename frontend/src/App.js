import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Upload from './pages/Upload';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('piviUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserId(user.id);
      setUserEmail(user.email);
      setIsLoggedIn(true);
      console.log('🔐 USER_RESTORED_FROM_STORAGE', user);
    }
  }, []);

  const handleLogin = (email) => {
    const userId = 'user_' + Date.now();
    setUserId(userId);
    setUserEmail(email);
    setIsLoggedIn(true);
    localStorage.setItem('piviUser', JSON.stringify({ id: userId, email }));
    console.log('✅ LOGIN_SUCCESS', { userId, email });
  };

  const handleSignUp = (email) => {
    const userId = 'user_' + Date.now();
    const newUser = { id: userId, email, createdAt: new Date().toISOString() };
    setUserId(userId);
    setUserEmail(email);
    setIsLoggedIn(true);
    localStorage.setItem('piviUser', JSON.stringify(newUser));
    console.log('🎉 SIGNUP_SUCCESS', newUser);
  };

  const handleLogout = () => {
    console.log('🚪 LOGOUT', { userId, email: userEmail });
    setIsLoggedIn(false);
    setUserEmail('');
    setUserId('');
    localStorage.removeItem('piviUser');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
        <Route 
          path="/" 
          element={isLoggedIn ? <Feed userId={userId} userEmail={userEmail} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={isLoggedIn ? <Profile userId={userId} userEmail={userEmail} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/messages" 
          element={isLoggedIn ? <Messages userId={userId} userEmail={userEmail} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/upload" 
          element={isLoggedIn ? <Upload userId={userId} userEmail={userEmail} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;