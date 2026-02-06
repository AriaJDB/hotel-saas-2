import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClientStyles.css';

const Registro = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        tipo: 'cliente'
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();

        if (formData.contrasena !== formData.confirmarContrasena) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            const respuesta = await axios.post('http://localhost:3000/usuarios/nuevo', {
                nombre: formData.nombre,
                correo: formData.correo,
                contrasena: formData.contrasena,
                tipo: formData.tipo
            });

            if (respuesta.data === true) {
                alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
                navigate('/login');
            } else {
                alert("Error en el registro. Por favor verifica los datos.");
            }
        } catch (error) {
            console.error('Error en registro:', error);
            alert("Error al registrarse. Por favor intenta de nuevo.");
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

            {/* Register Section */}
            <section className="auth-section">
                <div className="container">
                    <div className="auth-container">
                        <div className="auth-card auth-card-wide">
                            <div className="auth-header">
                                <h2>Crear Cuenta</h2>
                                <p>Complete el formulario para comenzar a disfrutar de nuestros servicios</p>
                            </div>

                            <form className="auth-form" onSubmit={manejarEnvio}>
                                <div className="form-section">
                                    <h4>Información Personal</h4>
                                    <div className="form-field">
                                        <label>Nombre Completo</label>
                                        <input
                                            type="text"
                                            className="input"
                                            name="nombre"
                                            placeholder="Juan Pérez"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Correo Electrónico</label>
                                        <input
                                            type="email"
                                            className="input"
                                            name="correo"
                                            placeholder="correo@ejemplo.com"
                                            value={formData.correo}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h4>Seguridad de la Cuenta</h4>
                                    <div className="form-field">
                                        <label>Contraseña</label>
                                        <input
                                            type="password"
                                            className="input"
                                            name="contrasena"
                                            placeholder="Mínimo 8 caracteres"
                                            value={formData.contrasena}
                                            onChange={handleChange}
                                            required
                                            minLength="8"
                                        />
                                        <small className="input-hint">Debe contener al menos 8 caracteres</small>
                                    </div>
                                    <div className="form-field">
                                        <label>Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            className="input"
                                            name="confirmarContrasena"
                                            placeholder="Confirme su contraseña"
                                            value={formData.confirmarContrasena}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-section">
                                    <label className="checkbox-label-block">
                                        <input type="checkbox" required />
                                        <span>Acepto los Términos y Condiciones y la Política de Privacidad</span>
                                    </label>
                                </div>

                                <button type="submit" className="btn-submit">
                                    Crear Cuenta
                                </button>
                            </form>

                            <div className="auth-footer">
                                <p>¿Ya tiene una cuenta? <Link to="/login" className="link-primary">Inicie sesión aquí</Link></p>
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

export default Registro;