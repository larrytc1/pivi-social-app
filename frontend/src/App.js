import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Messages from './pages/Messages';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;