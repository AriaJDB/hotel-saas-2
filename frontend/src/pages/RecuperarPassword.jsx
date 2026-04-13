import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { Link } from 'react-router-dom';
import '../styles/RecuperarPassword.css';
const RecuperarPassword = () => {

    const [correo, setCorreo] = useState('');
    const [nuevaPass, setNuevaPass] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('success');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación
        if (nuevaPass !== confirmar) {
            setMensaje("Las contraseñas no coinciden");
            setTipoMensaje("error");
            return;
        }

        try {
            // SIMULADO
            setMensaje("Contraseña actualizada correctamente");
            setTipoMensaje("success");

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error(error);
            setMensaje("Error al actualizar contraseña");
            setTipoMensaje("error");
        }
    };

    return (
        <div className="auth-section">
            <div className="container">
                <div className="auth-container">
                    <div className="auth-card">

                        <h2>Recuperar Contraseña</h2>

                        {mensaje && (
                            <div className={tipoMensaje === 'error' ? 'alert-error' : 'alert-success'}>
                                {mensaje}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">

                            <input
                                type="email"
                                className="input"
                                placeholder="Correo electrónico"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                            />

                            <input
                                type="password"
                                className="input"
                                placeholder="Nueva contraseña"
                                value={nuevaPass}
                                onChange={(e) => setNuevaPass(e.target.value)}
                                required
                            />

                            <input
                                type="password"
                                className="input"
                                placeholder="Confirmar contraseña"
                                value={confirmar}
                                onChange={(e) => setConfirmar(e.target.value)}
                                required
                            />

                            <button type="submit" className="btn-submit">
                                Cambiar contraseña
                            </button>
                        </form>
                        <div style={{ marginTop: "15px", textAlign: "center" }}>
                            
                            <p>
                                <Link to="/login" className="link-primary">
                                    ← Volver al login
                                </Link>
                            </p>

                            <p>
                                <Link to="/" className="link-secondary">
                                    Ir al inicio
                                </Link>
                            </p>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecuperarPassword;