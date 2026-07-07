import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Upload from './pages/Upload';
import { getUserByEmail, getAllUsers } from './utils/userDatabase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('piviCurrentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserId(user.id);
      setUserEmail(user.email);
      setIsLoggedIn(true);
      console.log('🔑 USER_RESTORED_FROM_STORAGE', user);
    }
  }, []);

  const handleLogin = (email, password) => {
    const user = getUserByEmail(email);
    if (!user) {
      console.log('❌ LOGIN_FAILED - USER_NOT_FOUND', { email });
      return false;
    }
    
    if (user.password !== password) {
      console.log('❌ LOGIN_FAILED - WRONG_PASSWORD', { email });
      return false;
    }

    setUserId(user.id);
    setUserEmail(user.email);
    setIsLoggedIn(true);
    localStorage.setItem('piviCurrentUser', JSON.stringify({ id: user.id, email: user.email }));
    console.log('✅ LOGIN_SUCCESS', { userId: user.id, email });
    return true;
  };

  const handleSignUp = (email, password) => {
    // Check if email already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      console.log('❌ SIGNUP_FAILED - EMAIL_ALREADY_EXISTS', { email });
      return false;
    }

    const userId = 'user_' + Date.now();
    const newUser = { 
      id: userId, 
      email, 
      password,
      createdAt: new Date().toISOString(),
      posts: [],
      followers: 0,
      following: 0
    };
    
    // Store in localStorage
    const allUsers = getAllUsers();
    allUsers.push(newUser);
    localStorage.setItem('piviUsers', JSON.stringify(allUsers));
    
    setUserId(userId);
    setUserEmail(email);
    setIsLoggedIn(true);
    localStorage.setItem('piviCurrentUser', JSON.stringify({ id: userId, email }));
    console.log('🎉 SIGNUP_SUCCESS', newUser);
    return true;
  };

  const handleLogout = () => {
    console.log('🚪 LOGOUT', { userId, email: userEmail });
    setIsLoggedIn(false);
    setUserEmail('');
    setUserId('');
    localStorage.removeItem('piviCurrentUser');
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