import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminStyles.css';

const AdminDashboard = () => {
    const [usuario, setUsuario] = useState(null);
    const [habitaciones, setHabitaciones] = useState([]);
    const [reservaciones, setReservaciones] = useState([]);

    useEffect(() => {
        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) {
            setUsuario(JSON.parse(usuarioData));
        }
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [habRes, resRes] = await Promise.all([
                axios.get('http://localhost:3000/habitaciones'),
                axios.get('http://localhost:3000/reservaciones')
            ]);
            setHabitaciones(habRes.data);
            setReservaciones(resRes.data);
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    };

    return (
        <div>
            {/* Header */}
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo-section">
                            <svg className="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            <div className="logo-text">
                                <h1>HotelFlow</h1>
                                <p>Panel de Administración</p>
                            </div>
                        </div>
                        <nav className="main-nav">
                            <a href="#dashboard" className="nav-link active">Dashboard</a>
                            <a href="#reservaciones" className="nav-link">Reservaciones</a>
                            <a href="#habitaciones" className="nav-link">Habitaciones</a>
                        </nav>
                        <div className="header-actions">
                            <div className="admin-profile">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span>{usuario?.nombre || 'Admin'}</span>
                            </div>
                            <button className="btn-outline" onClick={cerrarSesion}>Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Dashboard Section */}
            <section id="dashboard" className="dashboard-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Panel de Control</h2>
                        <p className="section-subtitle">Resumen general del sistema de reservaciones</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card stat-card-blue">
                            <div className="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <polyline points="17 11 19 13 23 9"></polyline>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h3>Reservaciones Activas</h3>
                                <p className="stat-number">{reservaciones.length}</p>
                                <span className="stat-change stat-positive">Sistema activo</span>
                            </div>
                        </div>

                        <div className="stat-card stat-card-green">
                            <div className="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M2 4v16"></path>
                                    <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h3>Habitaciones Totales</h3>
                                <p className="stat-number">{habitaciones.length}</p>
                                <span className="stat-change stat-neutral">Disponibles</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Reservations */}
                    <div className="dashboard-section-content">
                        <div className="content-header">
                            <h3>Reservaciones Recientes</h3>
                        </div>

                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Habitación</th>
                                        <th>Fecha Entrada</th>
                                        <th>Fecha Salida</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservaciones.slice(0, 5).map(res => (
                                        <tr key={res.id}>
                                            <td>#{res.id}</td>
                                            <td>{res.num_hab}</td>
                                            <td>{res.fecha_entrada}</td>
                                            <td>{res.fecha_salida}</td>
                                            <td><span className="badge badge-confirmed">{res.estado_reserva}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Rooms Management */}
                    <div className="dashboard-section-content">
                        <div className="content-header">
                            <h3>Gestión de Habitaciones</h3>
                        </div>

                        <div className="rooms-admin-grid">
                            {habitaciones.slice(0, 6).map(hab => (
                                <div key={hab.id} className="room-admin-card">
                                    <div className="room-admin-header">
                                        <h4>{hab.tipo}</h4>
                                        <span className={`room-status ${hab.estado === 'Disponible' ? 'room-available' : 'room-occupied'}`}>
                                            {hab.estado}
                                        </span>
                                    </div>
                                    <div className="room-admin-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Precio:</span>
                                            <span className="detail-value">${hab.precio_noche}/noche</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Número:</span>
                                            <span className="detail-value">Hab. {hab.num}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-section">
                            <h3>HotelFlow</h3>
                            <p>Sistema de reservaciones en línea para hoteles de categoría premium.</p>
                        </div>
                        <div className="footer-section">
                            <h4>Contacto</h4>
                            <p>Email: admin@hotelflow.com</p>
                            <p>Tel: +1 (555) 123-4567</p>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 HotelFlow. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard;
