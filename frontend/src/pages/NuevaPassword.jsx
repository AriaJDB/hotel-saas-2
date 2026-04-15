import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/Login.css';
import { resetPassword } from '../api/usuariosService';

const NuevaPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [nuevaPass, setNuevaPass] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');
    const [exito, setExito] = useState(false);

    // Si no hay token en la URL redirigir
    useEffect(() => {
        if (!token) {
            navigate('/recuperar');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nuevaPass.length < 6) {
            setMensaje('La contraseña debe tener al menos 6 caracteres');
            setTipoMensaje('error');
            return;
        }
        if (nuevaPass !== confirmar) {
            setMensaje('Las contraseñas no coinciden');
            setTipoMensaje('error');
            return;
        }

        setCargando(true);
        setMensaje('');

        try {
            const resultado = await resetPassword(token, nuevaPass);
            if (resultado.exito !== false) {
                setExito(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setMensaje(resultado.mensaje || 'Error al cambiar la contraseña');
                setTipoMensaje('error');
            }
        } catch (err) {
            const msg = err?.response?.data?.mensaje || 'Error al cambiar la contraseña';
            setMensaje(msg);
            setTipoMensaje('error');
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
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔒</div>
                            <h2>Nueva contraseña</h2>
                            <p>Escribe tu nueva contraseña para acceder a tu cuenta</p>
                        </div>

                        {exito ? (
                            <div style={{
                                background: '#f0fdf4',
                                border: '1.5px solid #86efac',
                                borderRadius: '8px',
                                padding: '20px',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
                                <p style={{ color: '#15803d', fontWeight: 600, margin: '0 0 6px' }}>
                                    ¡Contraseña actualizada!
                                </p>
                                <p style={{ color: '#166534', fontSize: '0.9rem', margin: 0 }}>
                                    Serás redirigido al inicio de sesión en unos segundos...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="auth-form">
                                {mensaje && (
                                    <div style={{
                                        background: tipoMensaje === 'error' ? '#ef4444' : '#22c55e',
                                        color: 'white',
                                        padding: '10px',
                                        borderRadius: '6px'
                                    }}>{mensaje}</div>
                                )}

                                <div className="form-field">
                                    <label>Nueva contraseña</label>
                                    <input
                                        type="password"
                                        className="input"
                                        placeholder="Mínimo 6 caracteres"
                                        value={nuevaPass}
                                        onChange={(e) => setNuevaPass(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label>Confirmar contraseña</label>
                                    <input
                                        type="password"
                                        className="input"
                                        placeholder="Repite la nueva contraseña"
                                        value={confirmar}
                                        onChange={(e) => setConfirmar(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn-submit" disabled={cargando}>
                                    {cargando ? 'Guardando...' : 'Guardar nueva contraseña'}
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

export default NuevaPassword;
