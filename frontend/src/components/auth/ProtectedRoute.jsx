import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute - Componente reutilizable para proteger rutas según rol.
 * 
 * @param {React.ReactNode} children - Componente a renderizar si el acceso es válido
 * @param {string[]} rolesPermitidos - Roles que tienen acceso a esta ruta (e.g. ['admin'])
 * @param {string} redireccion - Ruta a redirigir si no tiene acceso (default: '/login')
 */
const ProtectedRoute = ({ children, rolesPermitidos = [], redireccion = '/login' }) => {
    const usuarioRaw = localStorage.getItem('usuario');

    // Sin sesión → redirigir a login
    if (!usuarioRaw) {
        return <Navigate to="/login" replace />;
    }

    const usuario = JSON.parse(usuarioRaw);

    // Si se especifican roles y el usuario no pertenece a ninguno → redirigir
    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.tipo)) {
        return <Navigate to={redireccion} replace />;
    }

    return children;
};

export default ProtectedRoute;
