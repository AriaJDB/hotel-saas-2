import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const navigate = useNavigate();

    const manejarLogin = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await axios.post('http://localhost:3000/usuarios/login', {
                correo,
                contrasena
            });

            if (respuesta.data && typeof respuesta.data === 'object') {
                alert(`¡Bienvenido ${respuesta.data.nombre}!`);
                localStorage.setItem('usuario', JSON.stringify(respuesta.data));

                // Redirección según tipo de usuario
                if (respuesta.data.tipo === 'admin') {
                    navigate('/admin');
                } else if (respuesta.data.tipo === 'mucama') {
                    navigate('/cleaning');
                } else {
                    navigate('/dashboard');
                }
            } else {
                alert("Credenciales incorrectas. Verifica tu correo y contraseña.");
            }
        } catch (error) {
            console.error('Error en login:', error);
            alert("Error al iniciar sesión. Por favor intenta de nuevo.");
        }
    };

    return (
        <div>
            {/* Header */}
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo-section">
                            <svg className="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            <div className="logo-text">
                                <h1>HotelFlow</h1>
                                <p>Sistema de Reservaciones</p>
                            </div>
                        </Link>
                        <nav className="main-nav">
                            <Link to="/" className="nav-link">Inicio</Link>
                            <a href="/#habitaciones" className="nav-link">Habitaciones</a>
                            <a href="/#servicios" className="nav-link">Servicios</a>
                        </nav>
                        <div className="header-actions">
                            <Link to="/login" className="btn-outline">Iniciar Sesión</Link>
                            <Link to="/registro" className="btn-primary">Registrarse</Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Login Section */}
            <section className="auth-section">
                <div className="container">
                    <div className="auth-container">
                        <div className="auth-card">
                            <div className="auth-header">
                                <h2>Bienvenido de Nuevo</h2>
                                <p>Ingrese sus credenciales para acceder a su cuenta</p>
                            </div>

                            <form className="auth-form" onSubmit={manejarLogin}>
                                <div className="form-field">
                                    <label>Correo Electrónico</label>
                                    <input
                                        type="email"
                                        className="input"
                                        placeholder="correo@ejemplo.com"
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label>Contraseña</label>
                                    <input
                                        type="password"
                                        className="input"
                                        placeholder="Ingrese su contraseña"
                                        value={contrasena}
                                        onChange={(e) => setContrasena(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-options">
                                    <label className="checkbox-inline">
                                        <input type="checkbox" />
                                        <span>Recordarme</span>
                                    </label>
                                </div>

                                <button type="submit" className="btn-submit">
                                    Iniciar Sesión
                                </button>
                            </form>

                            <div className="auth-footer">
                                <p>¿No tiene una cuenta? <Link to="/registro" className="link-primary">Regístrese aquí</Link></p>
                            </div>
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
                            <p>Email: reservas@hotelflow.com</p>
                            <p>Tel: +1 (555) 123-4567</p>
                        </div>
                        <div className="footer-section">
                            <h4>Horarios</h4>
                            <p>Check-in: 3:00 PM</p>
                            <p>Check-out: 12:00 PM</p>
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

export default Login;