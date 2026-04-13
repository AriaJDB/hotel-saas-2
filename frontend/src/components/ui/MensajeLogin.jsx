import React, { useEffect, useState } from 'react';

const MensajeLogin = () => {
    const [mensaje, setMensaje] = useState('');
    const [tipo, setTipo] = useState('success');

    useEffect(() => {
        const msg = localStorage.getItem('mensajeLogin');
        const tipoMsg = localStorage.getItem('tipoMensaje');

        if (msg) {
            setMensaje(msg);
            setTipo(tipoMsg || 'success');

            localStorage.removeItem('mensajeLogin');
            localStorage.removeItem('tipoMensaje');

            setTimeout(() => {
                setMensaje('');
            }, 4000);
        }
    }, []);

    if (!mensaje) return null;

    const estilos = {
        success: {
            background: "#22c55e"
        },
        error: {
            background: "#ef4444"
        }
    };

    return (
        <div style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            padding: "12px 18px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            ...estilos[tipo]
        }}>
            {tipo === 'success' ? '✅' : '❌'} {mensaje}
        </div>
    );
};

export default MensajeLogin;