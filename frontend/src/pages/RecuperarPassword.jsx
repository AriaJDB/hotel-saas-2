import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';
import { solicitarRecuperacion } from '../api/usuariosService';

const RecuperarPassword = () => {
    const [correo, setCorreo] = useState('');
    const [enviado, setEnviado] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError('');

        try {
            await solicitarRecuperacion(correo);
            setEnviado(true);
        } catch (err) {
            setError('Ocurrió un error. Intenta de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="auth-section">
            <div className="container">
                <div className="auth-container">
                    <div className="auth-card">

                        <div className="auth-header">
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔑</div>
                            <h2>Recuperar contraseña</h2>
                            <p>Te enviaremos un enlace a tu correo para crear una nueva contraseña</p>
                        </div>

                        {enviado ? (
                            <div style={{
                                background: '#f0fdf4',
                                border: '1.5px solid #86efac',
                                borderRadius: '8px',
                                padding: '20px',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✉️</div>
                                <p style={{ color: '#15803d', fontWeight: 600, margin: '0 0 6px' }}>
                                    ¡Correo enviado!
                                </p>
                                <p style={{ color: '#166534', fontSize: '0.9rem', margin: 0 }}>
                                    Revisa tu bandeja de entrada en <strong>{correo}</strong>.<br />
                                    El enlace expira en 30 minutos.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="auth-form">
                                {error && (
                                    <div style={{
                                        background: '#ef4444', color: 'white',
                                        padding: '10px', borderRadius: '6px'
                                    }}>{error}</div>
                                )}
                                <div className="form-field">
                                    <label>Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="input"
                                        placeholder="correo@ejemplo.com"
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-submit" disabled={cargando}>
                                    {cargando ? 'Enviando...' : 'Enviar enlace de recuperación'}
                                </button>
                            </form>
                        )}

                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <Link to="/login" className="link-primary">← Volver al inicio de sesión</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecuperarPassword;