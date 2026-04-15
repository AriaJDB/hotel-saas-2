import React from 'react';
import './BiometricModal.css';

/**
 * Modal que aparece tras login exitoso preguntando si quiere activar huella dactilar
 */
const BiometricModal = ({ nombre, onAceptar, onRechazar }) => {
    return (
        <div className="bm-overlay">
            <div className="bm-card">
                <div className="bm-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 1C8.5 1 6 3.5 6 7v1H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-1V7c0-3.5-2.5-6-6-6z"/>
                        <path d="M12 3c2.5 0 4 1.8 4 4v1H8V7c0-2.2 1.5-4 4-4z"/>
                        <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
                        <path d="M12 16.5v2"/>
                        {/* Fingerprint paths */}
                        <path d="M12 22c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6" strokeLinecap="round"/>
                        <path d="M12 18c-.8 0-1.5-.7-1.5-1.5S11.2 15 12 15s1.5.7 1.5 1.5" strokeLinecap="round"/>
                    </svg>
                </div>

                <h2 className="bm-title">¡Hola, {nombre}!</h2>
                <p className="bm-desc">
                    ¿Quieres activar el inicio de sesión con <strong>huella dactilar</strong> para la próxima vez?
                </p>

                <div className="bm-fingerprint-icon">
                    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M32 8C20 8 11 17 11 29c0 8 3 14 7 19" strokeLinecap="round"/>
                        <path d="M32 8c12 0 21 9 21 21 0 8-3 14-7 19" strokeLinecap="round"/>
                        <path d="M22 29c0-5.5 4.5-10 10-10s10 4.5 10 10c0 4-1.5 7.5-4 10" strokeLinecap="round"/>
                        <path d="M42 29c0 2.5-.5 5-1.5 7" strokeLinecap="round"/>
                        <path d="M27 29c0-2.8 2.2-5 5-5s5 2.2 5 5c0 1.5-.4 3-1 4" strokeLinecap="round"/>
                        <path d="M37 29c0 1-.2 2-.5 3" strokeLinecap="round"/>
                        <path d="M32 24v0" strokeLinecap="round"/>
                        <circle cx="32" cy="29" r="1" fill="currentColor"/>
                    </svg>
                </div>

                <div className="bm-actions">
                    <button className="bm-btn-primary" onClick={onAceptar}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M9 12l2 2 4-4"/>
                            <circle cx="12" cy="12" r="10"/>
                        </svg>
                        Sí, activar huella
                    </button>
                    <button className="bm-btn-secondary" onClick={onRechazar}>
                        Ahora no
                    </button>
                </div>

                <p className="bm-note">Solo se guarda en este dispositivo. Puedes desactivarlo después.</p>
            </div>
        </div>
    );
};

export default BiometricModal;
