import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ClientStyles.css';
import AvisoDePrivacidad from './AvisoDePrivacidad';
import PoliticaDePrivacidad from './PoliticaDePrivacidad';

const Registro = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        tipo: 'cliente'
    });
    const [privacyConsent, setPrivacyConsent] = useState(false);
    const [mostrarAviso, setMostrarAviso] = useState(false);
    const [mostrarPolitica, setMostrarPolitica] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const manejarEscape = (e) => {
            if (e.key === 'Escape') {
                setMostrarAviso(false);
                setMostrarPolitica(false);
            }
        };
        window.addEventListener('keydown', manejarEscape);
        return () => window.removeEventListener('keydown', manejarEscape);
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();

        if (!privacyConsent) {
            alert("Debe aceptar el Aviso de Privacidad y la Política de Privacidad para registrarse.");
            return;
        }

        if (formData.contrasena !== formData.confirmarContrasena) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            const respuesta = await axios.post('http://localhost:3000/usuarios/nuevo', {
                nombre: formData.nombre,
                correo: formData.correo,
                contrasena: formData.contrasena,
                tipo: formData.tipo,
                privacy_consent_accepted: true
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

                                <div className="form-section" style={{ marginBottom: '1.5rem' }}>
                                    <label className="checkbox-label-block" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            id="privacy-consent-checkbox"
                                            name="privacyConsent"
                                            checked={privacyConsent}
                                            onChange={(e) => setPrivacyConsent(e.target.checked)}
                                            required
                                            aria-required="true"
                                            aria-describedby="privacy-hint"
                                            style={{ width: 'auto', marginTop: '4px', cursor: 'pointer' }}
                                        />
                                        <span id="privacy-hint" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                            He leído y acepto el{' '}
                                            <button
                                                type="button"
                                                className="link-button"
                                                onClick={() => setMostrarAviso(true)}
                                                aria-haspopup="dialog"
                                            >
                                                Aviso de Privacidad
                                            </button>{' '}
                                            y la{' '}
                                            <button
                                                type="button"
                                                className="link-button"
                                                onClick={() => setMostrarPolitica(true)}
                                                aria-haspopup="dialog"
                                            >
                                                Política de Privacidad
                                            </button>
                                        </span>
                                    </label>
                                </div>

                                <button type="submit" className="btn-submit" disabled={!privacyConsent}>
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
                    <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <p>&copy; 2026 HotelFlow. Todos los derechos reservados.</p>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <Link to="/aviso-privacidad" style={{ textDecoration: 'underline', fontSize: '0.85rem' }}>Aviso de Privacidad</Link>
                            <Link to="/politica-privacidad" style={{ textDecoration: 'underline', fontSize: '0.85rem' }}>Política de Privacidad</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Modal Aviso de Privacidad */}
            {mostrarAviso && (
                <div 
                    className="modal-overlay" 
                    onClick={() => setMostrarAviso(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="aviso-modal-title"
                >
                    <div 
                        className="modal-content" 
                        onClick={(e) => e.stopPropagation()} 
                        style={{ maxWidth: '750px' }}
                    >
                        <div className="modal-header">
                            <h2 id="aviso-modal-title">Aviso de Privacidad</h2>
                            <button 
                                className="modal-close" 
                                onClick={() => setMostrarAviso(false)}
                                aria-label="Cerrar modal"
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <AvisoDePrivacidad isModal={true} />
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="btn-secondary" 
                                onClick={() => setMostrarAviso(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Política de Privacidad */}
            {mostrarPolitica && (
                <div 
                    className="modal-overlay" 
                    onClick={() => setMostrarPolitica(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="politica-modal-title"
                >
                    <div 
                        className="modal-content" 
                        onClick={(e) => e.stopPropagation()} 
                        style={{ maxWidth: '750px' }}
                    >
                        <div className="modal-header">
                            <h2 id="politica-modal-title">Política de Privacidad</h2>
                            <button 
                                className="modal-close" 
                                onClick={() => setMostrarPolitica(false)}
                                aria-label="Cerrar modal"
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <PoliticaDePrivacidad isModal={true} />
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="btn-secondary" 
                                onClick={() => setMostrarPolitica(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Registro;