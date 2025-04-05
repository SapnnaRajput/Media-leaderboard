import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Home } from './Pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<div>Dashboard</div>} />
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
