import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import CleaningDashboard from './pages/CleaningDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RecuperarPassword from './pages/RecuperarPassword';
import NuevaPassword from './pages/NuevaPassword';
import AvisoDePrivacidad from './pages/AvisoDePrivacidad';
import PoliticaDePrivacidad from './pages/PoliticaDePrivacidad';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<RecuperarPassword />} />
        <Route path="/nueva-password" element={<NuevaPassword />} />
        <Route path="/aviso-privacidad" element={<AvisoDePrivacidad />} />
        <Route path="/politica-privacidad" element={<PoliticaDePrivacidad />} />
        <Route path="/admin" element={
          <ProtectedRoute rolesPermitidos={['admin']} redireccion="/login">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute rolesPermitidos={['usuario']} redireccion="/login">
            <ClientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/cleaning" element={
          <ProtectedRoute rolesPermitidos={['mucama', 'empleado']} redireccion="/login">
            <CleaningDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
