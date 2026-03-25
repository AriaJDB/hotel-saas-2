import React from "react";
import { Link } from 'react-router-dom';
const Header = () => {
    return (
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
                            <a href="#contacto" className="nav-link">Contacto</a>
                        </nav>
                        <div className="header-actions">
                            <Link className="btn-outline" to="/login">Iniciar Sesión</Link>
                            <Link className="btn-primary" to="/registro">Registrarse</Link>
                        </div>
                    </div>
                </div>
            </header>
    );
};

export default Header;
