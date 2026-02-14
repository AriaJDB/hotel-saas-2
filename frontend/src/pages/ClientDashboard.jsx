import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ClientStyles.css';
import '../styles/ClientStyles-carousel-addon.css';

const ClientDashboard = () => {
    const [usuario, setUsuario] = useState(null);
    const [habitaciones, setHabitaciones] = useState([]);

    useEffect(() => {
        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) {
            setUsuario(JSON.parse(usuarioData));
        }
        cargarHabitaciones();
    }, []);

    const cargarHabitaciones = async () => {
        try {
            const response = await axios.get('http://localhost:3000/habitaciones');
            setHabitaciones(response.data);
        } catch (error) {
            console.error('Error cargando habitaciones:', error);
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
                                <p>Sistema de Reservaciones</p>
                            </div>
                        </div>
                        <nav className="main-nav">
                            <a href="#inicio" className="nav-link active">Inicio</a>
                            <a href="#habitaciones" className="nav-link">Habitaciones</a>
                            <a href="#servicios" className="nav-link">Servicios</a>
                        </nav>
                        <div className="header-actions">
                            <div className="admin-profile">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span>{usuario?.nombre || 'Usuario'}</span>
                            </div>
                            <button className="btn-outline" onClick={cerrarSesion}>Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content">
                        <h2 className="hero-title">Bienvenido a HotelFlow</h2>
                        <p className="hero-subtitle">Experiencia de hospedaje premium para viajeros de negocios y placer</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon feature-icon-blue">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                                </svg>
                            </div>
                            <h3>Múltiples Ubicaciones</h3>
                            <p>Hoteles en las principales ciudades del país</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon feature-icon-green">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h3>Confirmación Inmediata</h3>
                            <p>Reserva confirmada al instante sin esperas</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon feature-icon-purple">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                    <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                            </div>
                            <h3>Pago Seguro</h3>
                            <p>Transacciones protegidas y cifradas</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon feature-icon-orange">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <h3>Soporte 24/7</h3>
                            <p>Atención al cliente las 24 horas del día</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rooms Section */}
            <section className="rooms">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Nuestras Habitaciones</h2>
                        <p className="section-subtitle">Espacios diseñados para su comodidad y productividad</p>
                    </div>

                    <div className="rooms-grid">
                        {habitaciones.filter(h => h.estado === 'Disponible').map(hab => (
                            <article key={hab.id} className="room-card">
                                <div className="room-image">
                                    <div className="room-badge">Disponible</div>
                                    <div className="room-price">
                                        <span className="price-amount">${hab.precio_noche}</span>
                                        <span className="price-period">/noche</span>
                                    </div>
                                </div>
                                <div className="room-content">
                                    <h3 className="room-title">{hab.tipo}</h3>
                                    <p className="room-description">
                                        Perfecta para su estadía. Incluye todas las comodidades necesarias para una experiencia inolvidable.
                                    </p>
                                    <div className="room-amenities">
                                        <div className="amenity">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="9" cy="7" r="4"></circle>
                                            </svg>
                                            <span>Confortable</span>
                                        </div>
                                        <div className="amenity">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M2 4v16"></path>
                                                <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
                                            </svg>
                                            <span>Hab. {hab.num}</span>
                                        </div>
                                    </div>
                                    <button className="btn-reserve">
                                        Reservar Ahora
                                    </button>
                                </div>
                            </article>
                        ))}
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
                            <p>Email: reservas@hotelflow.com</p>
                            <p>Tel: +1 (555) 123-4567</p>
                            <p>Soporte 24/7</p>
                        </div>
                        <div className="footer-section">
                            <h4>Horarios</h4>
                            <p>Check-in: 3:00 PM</p>
                            <p>Check-out: 12:00 PM</p>
                            <p>Recepción: 24 horas</p>
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

export default ClientDashboard;
