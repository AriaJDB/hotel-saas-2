import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import MensajeLogin from '../components/ui/MensajeLogin';
import BiometricModal from '../components/ui/BiometricModal';
import {
    biometricsDisponibles,
    registrarHuella,
    verificarHuella,
    tieneHuellaRegistrada,
    obtenerUltimoUsuarioBiometrico,
    actualizarUltimoUsuario,
} from '../hooks/useBiometrics';

// Función reutilizable: determina la ruta según el tipo de usuario
export const obtenerRutaPorTipo = (tipo) => {
    switch (tipo) {
        case 'admin': return '/admin';
        case 'mucama':
        case 'empleado': return '/cleaning';  // "empleado" es alias de mucama
        default: return '/dashboard';
    }
};

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('success');

    // Estado para huella dactilar
    const [mostrarModalHuella, setMostrarModalHuella] = useState(false);
    const [datosLoginExitoso, setDatosLoginExitoso] = useState(null); // guardamos respuesta del server
    const [ultimoUsuarioBiometrico, setUltimoUsuarioBiometrico] = useState(null);
    const [soportaHuella, setSoportaHuella] = useState(false);

    useEffect(() => {
        setSoportaHuella(biometricsDisponibles());
        const ultimo = obtenerUltimoUsuarioBiometrico();
        setUltimoUsuarioBiometrico(ultimo);
    }, []);

    // ── Detectar si el correo escrito tiene huella registrada ──
    const correoTieneHuella = soportaHuella && correo && tieneHuellaRegistrada(correo);

    // ────────────────────────────────────────────────────────────
    // Login con correo/contraseña (flujo normal)
    // ────────────────────────────────────────────────────────────
    const manejarLogin = async (e) => {
        e.preventDefault();

        try {
            const respuesta = await axios.post('http://localhost:3000/usuarios/login', {
                correo,
                contrasena
            });

            if (respuesta.data && respuesta.data.tipo) {
                completarLogin(respuesta.data);
            } else {
                setMensaje('Credenciales incorrectas');
                setTipoMensaje('error');
            }

        } catch (error) {
            console.error('Error en login:', error);
            setMensaje('Error al iniciar sesión');
            setTipoMensaje('error');
        }
    };

    // ────────────────────────────────────────────────────────────
    // Login con huella dactilar
    // ────────────────────────────────────────────────────────────
    const manejarLoginHuella = async () => {
        if (!correo) {
            setMensaje('Escribe tu correo primero');
            setTipoMensaje('error');
            return;
        }
        if (!tieneHuellaRegistrada(correo)) {
            setMensaje('No hay huella registrada para este correo');
            setTipoMensaje('error');
            return;
        }

        try {
            const autenticado = await verificarHuella(correo);
            if (!autenticado) {
                setMensaje('Huella no reconocida');
                setTipoMensaje('error');
                return;
            }

            // Huella ok → recuperar sesión desde el servidor (solo con correo, sin contraseña)
            const respuesta = await axios.post('http://localhost:3000/usuarios/login-biometrico', { correo });

            if (respuesta.data && respuesta.data.tipo) {
                actualizarUltimoUsuario(correo);
                completarLoginSinModalHuella(respuesta.data);
            } else {
                setMensaje('Error al iniciar sesión biométrica');
                setTipoMensaje('error');
            }
        } catch (err) {
            console.error('Error en login biométrico:', err);
            setMensaje('Error al autenticar con huella');
            setTipoMensaje('error');
        }
    };

    // ────────────────────────────────────────────────────────────
    // Completar login → si no tiene huella aún, preguntar
    // ────────────────────────────────────────────────────────────
    const completarLogin = (datos) => {
        const cambioDeUsuario = ultimoUsuarioBiometrico && ultimoUsuarioBiometrico !== datos.correo;
        const yaRegistroHuella = tieneHuellaRegistrada(datos.correo);

        // Preguntar si quiere registrar huella:
        // - Si el navegador lo soporta
        // - Y no tiene huella aún para este correo
        // - O cambió de cuenta (para ofrecer registrar al nuevo usuario)
        if (soportaHuella && (!yaRegistroHuella || cambioDeUsuario) && !yaRegistroHuella) {
            setDatosLoginExitoso(datos);
            setMostrarModalHuella(true);
        } else {
            guardarSesionYNavegar(datos);
        }
    };

    const completarLoginSinModalHuella = (datos) => {
        guardarSesionYNavegar(datos);
    };

    const guardarSesionYNavegar = (datos) => {
        const sesion = {
            ...datos,
            expira: Date.now() + (30 * 60 * 1000)
        };
        localStorage.setItem('usuario', JSON.stringify(sesion));
        localStorage.setItem('mensajeLogin', `Bienvenido ${datos.nombre}`);
        localStorage.setItem('tipoMensaje', 'success');
        navigate(obtenerRutaPorTipo(datos.tipo));
    };

    // ────────────────────────────────────────────────────────────
    // Respuesta del modal de huella
    // ────────────────────────────────────────────────────────────
    const handleAceptarHuella = async () => {
        setMostrarModalHuella(false);
        const exito = await registrarHuella(datosLoginExitoso.correo, datosLoginExitoso.nombre);
        if (exito) {
            actualizarUltimoUsuario(datosLoginExitoso.correo);
        }
        guardarSesionYNavegar(datosLoginExitoso);
    };

    const handleRechazarHuella = () => {
        setMostrarModalHuella(false);
        guardarSesionYNavegar(datosLoginExitoso);
    };

    return (
        <div>
            <MensajeLogin />

            {/* Modal huella dactilar */}
            {mostrarModalHuella && datosLoginExitoso && (
                <BiometricModal
                    nombre={datosLoginExitoso.nombre}
                    onAceptar={handleAceptarHuella}
                    onRechazar={handleRechazarHuella}
                />
            )}

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
                            {mensaje && (
                                <div style={{
                                    background: tipoMensaje === 'error' ? '#ef4444' : '#22c55e',
                                    color: 'white',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    marginBottom: '10px'
                                }}>
                                    {mensaje}
                                </div>
                            )}

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
                                        required={!correoTieneHuella}
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

                                {/* Botón huella dactilar (solo si tiene huella registrada para ese correo) */}
                                {correoTieneHuella && (
                                    <button
                                        type="button"
                                        className="btn-biometric"
                                        onClick={manejarLoginHuella}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                                            <path d="M12 1C8.5 1 6 3.8 6 7v1" strokeLinecap="round"/>
                                            <path d="M18 8V7c0-3.2-2.5-6-6-6" strokeLinecap="round"/>
                                            <path d="M9 16c0 1.7 1.3 3 3 3s3-1.3 3-3v-3.5" strokeLinecap="round"/>
                                            <path d="M6 10c0-3.3 2.7-6 6-6s6 2.7 6 6v2" strokeLinecap="round"/>
                                            <path d="M9 12.5c0-1.7 1.3-3 3-3s3 1.3 3 3" strokeLinecap="round"/>
                                            <line x1="3" y1="3" x2="21" y2="21" stroke="#ef4444" strokeWidth="0"/>
                                        </svg>
                                        Entrar con huella dactilar
                                    </button>
                                )}

                                <p style={{ marginTop: "10px", textAlign: "center" }}>
                                    <Link to="/recuperar" className="link-primary">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </p>
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