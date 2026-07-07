import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Upload from './pages/Upload';
import {
  getUserByEmail,
  getAllUsers,
  hashPassword,
  migrateLegacyUserPassword,
  saveAllUsers,
  verifyUserPassword
} from './utils/userDatabase';

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

  const handleLogin = async (email, password) => {
    const user = getUserByEmail(email);
    if (!user) {
      console.log('❌ LOGIN_FAILED - USER_NOT_FOUND', { email });
      return { success: false, error: 'Email not found. Please sign up first.' };
    }
    
    const passwordMatches = await verifyUserPassword(user, password);
    if (!passwordMatches) {
      console.log('❌ LOGIN_FAILED - WRONG_PASSWORD', { email });
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    if (user.password && !user.passwordHash) {
      await migrateLegacyUserPassword(user.id, password);
    }

    setUserId(user.id);
    setUserEmail(user.email);
    setIsLoggedIn(true);
    localStorage.setItem('piviCurrentUser', JSON.stringify({ id: user.id, email: user.email }));
    console.log('✅ LOGIN_SUCCESS', { userId: user.id, email });
    return { success: true };
  };

  const handleSignUp = async (email, password) => {
    // Check if email already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      console.log('❌ SIGNUP_FAILED - EMAIL_ALREADY_EXISTS', { email });
      return { success: false, error: 'This email is already registered. Please sign in instead.' };
    }

    const userId = 'user_' + Date.now();
    const newUser = { 
      id: userId, 
      email, 
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
      posts: [],
      followers: 0,
      following: 0
    };
    
    // Store in localStorage
    const allUsers = getAllUsers();
    allUsers.push(newUser);
    saveAllUsers(allUsers);
    
    setUserId(userId);
    setUserEmail(email);
    setIsLoggedIn(true);
    localStorage.setItem('piviCurrentUser', JSON.stringify({ id: userId, email }));
    console.log('🎉 SIGNUP_SUCCESS', { userId, email });
    return { success: true };
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