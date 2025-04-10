import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Home } from './Pages/Home';
import Login from './Pages/Auth/Login';
import Signup from './Pages/Auth/Signup';
import VerifyEmail from './Pages/Auth/VerifyEmail';
import Social from './Pages/Social/Social';
import './utils/axiosConfig';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="social" element={<Social />} />
          <Route path="media" element={<div>Media Outlets</div>} />
          <Route path="journalists" element={<div>Journalists</div>} />
          <Route path="analytics" element={<div>Analytics</div>} />
          <Route path="campaigns" element={<div>Campaigns</div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
