const AdminHeader = ({
    usuario,
    vistaActual,
    setVistaActual,
    cerrarSesion
}) => {
    return (
        <header>
            {<header className="header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo-section">
                            <svg className="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            <div className="logo-text">
                                <h1>HotelFlow</h1>
                                <p>Panel de Administración</p>
                            </div>
                        </div>
                        <nav className="main-nav">
                            <a href="#" className={vistaActual === 'dashboard' ? 'nav-link active' : 'nav-link'} onClick={() => setVistaActual('dashboard')}>Dashboard</a>
                            <a href="#" className={vistaActual === 'habitaciones' ? 'nav-link active' : 'nav-link'} onClick={() => setVistaActual('habitaciones')}>Habitaciones</a>
                            <a href="#" className={vistaActual === 'reservaciones' ? 'nav-link active' : 'nav-link'} onClick={() => setVistaActual('reservaciones')}>Reservaciones</a>
                            <a href="#" className={vistaActual === 'usuarios' ? 'nav-link active' : 'nav-link'} onClick={() => setVistaActual('usuarios')}>Usuarios</a>
                            <a href="#" className={vistaActual === 'articulos' ? 'nav-link active' : 'nav-link'} onClick={() => setVistaActual('articulos')}>Artículos</a>
                        </nav>
                        <div className="header-actions">
                            <div className="admin-profile">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span>{usuario?.nombre || 'Admin'}</span>
                            </div>
                            <button className="btn-outline" onClick={cerrarSesion}>Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            </header>}
        </header>
    );
};

export default AdminHeader;