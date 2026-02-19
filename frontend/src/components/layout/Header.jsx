import React from "react";

const Header = ({ usuario, cerrarSesion }) => {
    return (
        <header className="header">
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo-section">
                            <svg className="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            <div className="logo-text">
                                <h1>HotelFlow</h1>
                                <p>Sistema de Reservaciones</p>
                            </div>
                        </div>
                        <nav className="main-nav">
                            <a href="#inicio" className="nav-link active">Inicio</a>
                            <a href="#habitaciones" className="nav-link">Habitaciones</a>
                            <a href="#servicios" className="nav-link">Servicios</a>
                        </nav>
                        <div className="header-actions">
                            <div className="admin-profile">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span>{usuario?.nombre || 'Usuario'}</span>
                            </div>
                            <button className="btn-outline" onClick={cerrarSesion}>Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            </header>
        </header>
    );
};

export default Header;
