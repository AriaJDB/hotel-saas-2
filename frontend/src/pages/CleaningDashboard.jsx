import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/CleaningStyles.css';

const CleaningDashboard = () => {
    const [usuario, setUsuario] = useState(null);
    const [habitaciones, setHabitaciones] = useState([]);

    useEffect(() => {
        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) setUsuario(JSON.parse(usuarioData));
        cargarHabitaciones();
    }, []);

    // Reemplaza tu actual cargarHabitaciones y aplicarBusqueda
// Dentro de ClientDashboard.jsx

const cargarHabitaciones = async (filtrosActivos = {}) => {
    try {
        setLoading(true);
        // IMPORTANTE: Se pasan los filtros en la propiedad 'params'
        const response = await axios.get('http://localhost:3000/habitaciones', { 
            params: filtrosActivos 
        });
        
        // Filtramos disponibilidad localmente o en el backend
        const disponibles = response.data.filter(h => h.estado === 'Disponible' || h.estado === 'Libre');
        setHabitaciones(disponibles);
        
        // Reiniciar carruseles para los nuevos resultados
        const initialImages = {};
        disponibles.forEach(hab => { initialImages[hab.id] = 0; });
        setCurrentImages(initialImages);
        setError(null);
    } catch (error) {
        setError('Error al conectar con el servidor');
    } finally {
        setLoading(false);
    }
};

// Esta es la función que debe ejecutar tu botón "Aplicar Filtros"
const aplicarBusqueda = () => {
    console.log("Enviando filtros:", filtros); // Para depuración
    cargarHabitaciones(filtros);
};

const limpiarFiltros = () => {
    const reset = { q: '', tipoSeleccionado: '', min: '', max: '', amenidades: [] };
    setFiltros(reset);
    cargarHabitaciones(reset);
};

    const cerrarSesion = () => {
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    };

    const actualizarEstado = async (id, nuevoEstado) => {
        try {
            await axios.put(`http://localhost:3000/habitaciones/${id}`, { estado: nuevoEstado });
            cargarHabitaciones();
        } catch (error) {
            console.error('Error actualizando estado:', error);
        }
    };

    const habitacionesPorEstado = {
        limpieza: habitaciones.filter(h => h.estado === 'Limpieza'),
        disponible: habitaciones.filter(h => h.estado === 'Disponible'),
        ocupada: habitaciones.filter(h => h.estado === 'Ocupada'),
        mantenimiento: habitaciones.filter(h => h.estado === 'Mantenimiento')
    };

    return (
        <div>
            {/* Header */}
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
                                <p>Panel de Limpieza</p>
                            </div>
                        </div>
                        <div className="header-actions">
                            <div className="admin-profile">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span>{usuario?.nombre || 'Empleado'}</span>
                            </div>
                            <button className="btn-outline" onClick={cerrarSesion}>Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <section className="dashboard-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Panel de Limpieza</h2>
                        <p className="section-subtitle">Gestión de habitaciones por limpiar</p>
                    </div>

                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="stat-card stat-card-warning">
                            <div className="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h3>Por Limpiar</h3>
                                <p className="stat-number">{habitacionesPorEstado.limpieza.length}</p>
                                <span className="stat-change">Pendientes</span>
                            </div>
                        </div>

                        <div className="stat-card stat-card-green">
                            <div className="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h3>Limpias</h3>
                                <p className="stat-number">{habitacionesPorEstado.disponible.length}</p>
                                <span className="stat-change">Disponibles</span>
                            </div>
                        </div>

                        <div className="stat-card stat-card-blue">
                            <div className="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h3>Ocupadas</h3>
                                <p className="stat-number">{habitacionesPorEstado.ocupada.length}</p>
                                <span className="stat-change">En uso</span>
                            </div>
                        </div>
                    </div>

                    {/* Habitaciones por Limpiar */}
                    <div className="cleaning-section">
                        <h3 className="cleaning-section-title">Habitaciones Pendientes de Limpieza</h3>
                        
                        {habitacionesPorEstado.limpieza.length === 0 ? (
                            <div className="empty-state">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '4rem', height: '4rem', opacity: 0.5, marginBottom: '1rem' }}>
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <p>No hay habitaciones pendientes de limpieza</p>
                            </div>
                        ) : (
                            <div className="rooms-cleaning-grid">
                                {habitacionesPorEstado.limpieza.map(hab => (
                                    <div key={hab.id} className="cleaning-card">
                                        <div className="cleaning-card-header">
                                            <h4>Habitación {hab.num_ha}</h4>
                                            <span className="cleaning-badge cleaning-badge-pending">Limpieza</span>
                                        </div>
                                        <div className="cleaning-card-body">
                                            <p><strong>Tipo:</strong> {hab.tipo}</p>
                                            <p><strong>Piso:</strong> {hab.piso}</p>
                                            <p><strong>Amenidades:</strong> {hab.amenidades || 'Estándar'}</p>
                                        </div>
                                        <div className="cleaning-card-actions">
                                            <button 
                                                className="btn-complete"
                                                onClick={() => actualizarEstado(hab.id, 'Disponible')}
                                            >
                                                ✓ Marcar Limpia
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Todas las Habitaciones */}
                    <div className="cleaning-section">
                        <h3 className="cleaning-section-title">Todas las Habitaciones</h3>
                        
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th>Piso</th>
                                        <th>Tipo</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {habitaciones.map(hab => (
                                        <tr key={hab.id}>
                                            <td>Hab. {hab.num_ha}</td>
                                            <td>Piso {hab.piso}</td>
                                            <td>{hab.tipo}</td>
                                            <td>
                                                <span className={`badge ${
                                                    hab.estado === 'Disponible' ? 'badge-success' :
                                                    hab.estado === 'Limpieza' ? 'badge-warning' :
                                                    hab.estado === 'Ocupada' ? 'badge-info' :
                                                    'badge-danger'
                                                }`}>
                                                    {hab.estado}
                                                </span>
                                            </td>
                                            <td>
                                                {hab.estado === 'Limpieza' && (
                                                    <button 
                                                        className="btn-action btn-action-complete"
                                                        onClick={() => actualizarEstado(hab.id, 'Disponible')}
                                                    >
                                                        Completar
                                                    </button>
                                                )}
                                                {hab.estado === 'Disponible' && (
                                                    <button 
                                                        className="btn-action btn-action-clean"
                                                        onClick={() => actualizarEstado(hab.id, 'Limpieza')}
                                                    >
                                                        Limpiar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-bottom">
                        <p>&copy; 2026 HotelFlow. Panel de Limpieza.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CleaningDashboard;
