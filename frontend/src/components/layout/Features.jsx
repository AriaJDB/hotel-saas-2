const Features = () => {
    return (
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
    );
};

export default Features;
