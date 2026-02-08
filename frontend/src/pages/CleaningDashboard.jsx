import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CleaningStyles.css';

const CleaningDashboard = () => {
    const [usuario, setUsuario] = useState(null);
    const [habitaciones, setHabitaciones] = useState([
        { numero: '101', tipo: 'Suite', estado: 'pending', prioridad: 'high' },
        { numero: '102', tipo: 'Doble', estado: 'progress', prioridad: 'medium' },
        { numero: '103', tipo: 'Individual', estado: 'completed', prioridad: 'low' },
        { numero: '201', tipo: 'Suite', estado: 'pending', prioridad: 'high' },
        { numero: '202', tipo: 'Doble', estado: 'pending', prioridad: 'medium' },
        { numero: '301', tipo: 'Suite Ejecutiva', estado: 'completed', prioridad: 'low' }
    ]);
    const [filtro, setFiltro] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('usuario');
        if (usuarioGuardado) {
            const usuarioData = JSON.parse(usuarioGuardado);
            setUsuario(usuarioData);

            if (usuarioData.tipo !== 'mucama') {
                alert('Acceso denegado. Esta área es solo para personal de limpieza.');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    const iniciarLimpieza = (numero) => {
        setHabitaciones(prev =>
            prev.map(hab =>
                hab.numero === numero ? { ...hab, estado: 'progress' } : hab
            )
        );
    };

    const completarLimpieza = (numero) => {
        setHabitaciones(prev =>
            prev.map(hab =>
                hab.numero === numero ? { ...hab, estado: 'completed' } : hab
            )
        );
    };

    const habitacionesFiltradas = habitaciones.filter(hab => {
        if (filtro === 'all') return true;
        return hab.estado === filtro;
    });

    const stats = {
        pendientes: habitaciones.filter(h => h.estado === 'pending').length,
        enProgreso: habitaciones.filter(h => h.estado === 'progress').length,
        completadas: habitaciones.filter(h => h.estado === 'completed').length,
        total: habitaciones.length
    };

    const getEstadoTexto = (estado) => {
        const estados = {
            'pending': 'Pendiente',
            'progress': 'En Progreso',
            'completed': 'Completada'
        };
        return estados[estado] || estado;
    };

    const getPrioridadTexto = (prioridad) => {
        const prioridades = {
            'high': 'Alta',
            'medium': 'Media',
            'low': 'Baja'
        };
        return prioridades[prioridad] || prioridad;
    };

    if (!usuario) return null;

    return (
        <div className="cleaning-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo-section">
                            <svg className="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            <div className="logo-text">
                                <h1>HotelFlow</h1>
                                <p>Personal de Limpieza</p>
                            </div>
                        </div>
                        <div className="header-actions">
                            <span className="user-name">👋 {usuario.nombre}</span>
                            <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="container">
                    {/* Título */}
                    <div className="page-title">
                        <h2>Panel de Limpieza</h2>
                        <p>Gestiona las tareas de limpieza de habitaciones</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card stat-pending">
                            <div className="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h3>{stats.pendientes}</h3>
                                <p>Pendientes</p>
                            </div>
                        </div>

                        <div className="stat-card stat-progress">
                            <div className="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h3>{stats.enProgreso}</h3>
                                <p>En Progreso</p>
                            </div>
                        </div>

                        <div className="stat-card stat-completed">
                            <div className="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h3>{stats.completadas}</h3>
                                <p>Completadas</p>
                            </div>
                        </div>

                        <div className="stat-card stat-total">
                            <div className="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h3>{stats.total}</h3>
                                <p>Total</p>
                            </div>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="filters-section">
                        <h3>Filtrar por Estado</h3>
                        <div className="filter-buttons">
                            <button
                                className={`filter-btn ${filtro === 'all' ? 'active' : ''}`}
                                onClick={() => setFiltro('all')}
                            >
                                Todas
                            </button>
                            <button
                                className={`filter-btn ${filtro === 'pending' ? 'active' : ''}`}
                                onClick={() => setFiltro('pending')}
                            >
                                Pendientes
                            </button>
                            <button
                                className={`filter-btn ${filtro === 'progress' ? 'active' : ''}`}
                                onClick={() => setFiltro('progress')}
                            >
                                En Progreso
                            </button>
                            <button
                                className={`filter-btn ${filtro === 'completed' ? 'active' : ''}`}
                                onClick={() => setFiltro('completed')}
                            >
                                Completadas
                            </button>
                        </div>
                    </div>

                    {/* Habitaciones Grid */}
                    <div className="rooms-section">
                        <h3>Habitaciones ({habitacionesFiltradas.length})</h3>
                        <div className="rooms-grid">
                            {habitacionesFiltradas.map((habitacion) => (
                                <div key={habitacion.numero} className={`room-card room-${habitacion.estado}`}>
                                    <div className="room-header">
                                        <h4>Habitación {habitacion.numero}</h4>
                                        <span className={`badge badge-${habitacion.prioridad}`}>
                                            {getPrioridadTexto(habitacion.prioridad)}
                                        </span>
                                    </div>
                                    <div className="room-info">
                                        <p className="room-type">{habitacion.tipo}</p>
                                        <p className={`room-status status-${habitacion.estado}`}>
                                            {getEstadoTexto(habitacion.estado)}
                                        </p>
                                    </div>
                                    <div className="room-actions">
                                        {habitacion.estado === 'pending' && (
                                            <button
                                                className="btn-action btn-start"
                                                onClick={() => iniciarLimpieza(habitacion.numero)}
                                            >
                                                Iniciar Limpieza
                                            </button>
                                        )}
                                        {habitacion.estado === 'progress' && (
                                            <>
                                                <div className="progress-bar">
                                                    <div className="progress-fill"></div>
                                                </div>
                                                <button
                                                    className="btn-action btn-complete"
                                                    onClick={() => completarLimpieza(habitacion.numero)}
                                                >
                                                    Marcar Completada
                                                </button>
                                            </>
                                        )}
                                        {habitacion.estado === 'completed' && (
                                            <div className="completed-badge">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg>
                                                <span>Limpieza Completada</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="dashboard-footer">
                <div className="container">
                    <p>&copy; 2026 HotelFlow. Sistema de Gestión de Limpieza.</p>
                </div>
            </footer>
        </div>
    );
};

export default CleaningDashboard;
