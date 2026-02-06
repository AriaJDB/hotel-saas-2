import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import CleaningDashboard from './pages/CleaningDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/cleaning" element={<CleaningDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;