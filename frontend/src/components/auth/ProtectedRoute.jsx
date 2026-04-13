import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, rolesPermitidos = [], redireccion = '/login' }) => {

    const usuarioRaw = localStorage.getItem('usuario');

    // ❌ No hay sesión
    if (!usuarioRaw) {
        return <Navigate to={redireccion} replace />;
    }

    let usuario;

    try {
        usuario = JSON.parse(usuarioRaw);
    } catch (error) {
        localStorage.removeItem('usuario');
        return <Navigate to={redireccion} replace />;
    }

    // 🔥 VALIDAR EXPIRACIÓN DE SESIÓN
    const ahora = Date.now();

    if (usuario.expira && ahora > usuario.expira) {
        localStorage.removeItem('usuario');
        return <Navigate to={redireccion} replace />;
    }

    // 🔒 VALIDAR ROL
    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.tipo)) {
        return <Navigate to={redireccion} replace />;
    }

    return children;
};

export default ProtectedRoute;