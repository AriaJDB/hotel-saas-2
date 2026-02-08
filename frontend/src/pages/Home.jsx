import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ClientStyles.css';

const Home = () => {
    const [habitaciones, setHabitaciones] = useState([]);

    useEffect(() => {
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
                            <a href="#contacto" className="nav-link">Contacto</a>
                        </nav>
                        <div className="header-actions">
                            <Link className="btn-outline" to="/login">Iniciar Sesión</Link>
                            <Link className="btn-primary" to="/registro">Registrarse</Link>
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

                        {/* Booking Form */}
                        <div className="booking-card">
                            <h3 className="booking-title">Reserve su Habitación</h3>
                            <form className="booking-form">
                                <div className="form-grid">
                                    <div className="form-field">
                                        <label>Fecha de Entrada</label>
                                        <input type="date" className="input" required />
                                    </div>
                                    <div className="form-field">
                                        <label>Fecha de Salida</label>
                                        <input type="date" className="input" required />
                                    </div>
                                    <div className="form-field">
                                        <label>Huéspedes</label>
                                        <select className="input">
                                            <option>1 Adulto</option>
                                            <option>2 Adultos</option>
                                            <option>3 Adultos</option>
                                            <option>4+ Adultos</option>
                                        </select>
                                    </div>
                                    <div className="form-field">
                                        <label>Tipo de Habitación</label>
                                        <select className="input">
                                            <option>Todas</option>
                                            <option>Individual</option>
                                            <option>Doble</option>
                                            <option>Suite</option>
                                            <option>Suite Ejecutiva</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="btn-search">
                                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.35-4.35"></path>
                                    </svg>
                                    Buscar Disponibilidad
                                </button>
                            </form>
                        </div>
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
            <section id="habitaciones" className="rooms">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Nuestras Habitaciones</h2>
                        <p className="section-subtitle">Espacios diseñados para su comodidad y productividad</p>
                    </div>

                    <div className="rooms-grid">
                        {habitaciones.slice(0, 3).map(hab => (
                            <article key={hab.id} className="room-card">
                                <div className="room-image">
                                    <div className="room-badge">{hab.estado}</div>
                                    <div className="room-price">
                                        <span className="price-amount">${hab.precio_noche}</span>
                                        <span className="price-period">/noche</span>
                                    </div>
                                </div>
                                <div className="room-content">
                                    <h3 className="room-title">{hab.tipo}</h3>
                                    <p className="room-description">
                                        Perfecta para viajeros. Incluye escritorio ejecutivo, WiFi de alta velocidad y espacio de trabajo cómodo.
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
                                    <Link to="/registro" className="btn-reserve">
                                        Reservar Ahora
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="servicios" className="services">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Servicios Adicionales</h2>
                        <p className="section-subtitle">Complemente su estadía con nuestros servicios premium</p>
                    </div>

                    <div className="services-grid">
                        <div className="service-item">
                            <div className="service-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                </svg>
                            </div>
                            <h4>Desayuno Continental</h4>
                            <p>Buffet completo de 6:00 AM a 10:00 AM</p>
                            <span className="service-price">+ $15/día</span>
                        </div>
                        <div className="service-item">
                            <div className="service-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                            <h4>Late Check-out</h4>
                            <p>Salida hasta las 4:00 PM</p>
                            <span className="service-price">+ $25</span>
                        </div>
                        <div className="service-item">
                            <div className="service-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>
                            <h4>Traslado Aeropuerto</h4>
                            <p>Servicio privado ida y vuelta</p>
                            <span className="service-price">+ $30</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>¿Listo para Reservar?</h2>
                        <p>Únase a miles de huéspedes satisfechos y reserve su habitación hoy</p>
                        <Link className="btn-cta" to="/registro">Comenzar Ahora</Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contacto" className="footer">
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
                            <h4>Enlaces</h4>
                            <a href="#">Términos y Condiciones</a>
                            <a href="#">Política de Privacidad</a>
                            <a href="#">Política de Cancelación</a>
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

export default Home;
