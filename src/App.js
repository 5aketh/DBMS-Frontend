import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'

import Welcome from './components/welcome';
import Home from './components/home';
import Dashboard from './components/dashboard';
import LoginPage from './components/login';
import Records from './components/records';

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/404" element={<Welcome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/records" element={<Records />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/:type" element={<Home />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;