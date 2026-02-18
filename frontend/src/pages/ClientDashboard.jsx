import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ClientStyles.css';

const ClientDashboard = () => {
    const [usuario, setUsuario] = useState(null);
    const [habitaciones, setHabitaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImages, setCurrentImages] = useState({});

    // Paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [totalHabitaciones, setTotalHabitaciones] = useState(0);
    const LIMIT = 10;

    // Imágenes por tipo de habitación
    const roomImages = {
        'Individual': [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
        ],
        'Doble': [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
            'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'
        ],
        'Suite': [
            'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
            'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'
        ],
        'Suite Ejecutiva': [
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800'
        ]
    };

    useEffect(() => {
        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) setUsuario(JSON.parse(usuarioData));
        cargarHabitaciones();
    }, []);

    const cargarHabitaciones = async (pagina = 1) => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/habitaciones', {
                params: { page: pagina, limit: LIMIT }
            });

            const { datos, total, pagina: pag, totalPaginas: tp } = response.data;

            setHabitaciones(datos);
            setPaginaActual(pag);
            setTotalPaginas(tp);
            setTotalHabitaciones(total);

            // Inicializar índice de imagen para cada habitación
            const initialImages = {};
            datos.forEach(hab => { initialImages[hab.id] = 0; });
            setCurrentImages(initialImages);
            setError(null);

            // Log de habitaciones cargadas desde la API
            console.log('%c📦 Habitaciones cargadas desde la API:', 'color: #22c55e; font-weight: bold; font-size: 13px;');
            console.log(JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.error('Error cargando habitaciones:', error);
            setError('No se pudieron cargar las habitaciones');
        } finally {
            setLoading(false);
        }
    };

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
        cargarHabitaciones(nuevaPagina);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const obtenerHabitaciones = async () => {
        const res = await axios.get("/api/habitaciones", {
            params: {
                q: busqueda,
                tipo,
                min,
                max,
                sort
            }
        });

        setHabitaciones(res.data);
    };


    // Funciones del carrusel
    const nextImage = (habId, tipo) => {
        const images = roomImages[tipo] || roomImages['Individual'];
        setCurrentImages(prev => ({
            ...prev,
            [habId]: (prev[habId] + 1) % images.length
        }));
    };

    const prevImage = (habId, tipo) => {
        const images = roomImages[tipo] || roomImages['Individual'];
        setCurrentImages(prev => ({
            ...prev,
            [habId]: prev[habId] === 0 ? images.length - 1 : prev[habId] - 1
        }));
    };

    const goToImage = (habId, index) => {
        setCurrentImages(prev => ({
            ...prev,
            [habId]: index
        }));
    };

    const cerrarSesion = () => {
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    };

    const FILTROS_VACIOS = { q: '', tipo: '', min: '', max: '', sort: 'precio_asc' };
    const [filtros, setFiltros] = useState(FILTROS_VACIOS);
    const [filtrosAplicados, setFiltrosAplicados] = useState(FILTROS_VACIOS);
    const [panelAbierto, setPanelAbierto] = useState(false);

    const habitacionesDisponibles = habitaciones.filter(h => h.estado === 'Disponible');

    const buscarHabitaciones = (data, f) => {
        let resultado = [...data];

        if (f.q.trim()) {
            const q = f.q.trim().toLowerCase();
            resultado = resultado.filter(hab =>
                String(hab.num_ha ?? '').includes(q) ||
                String(hab.tipo ?? '').toLowerCase().includes(q) ||
                String(hab.amenidades ?? '').toLowerCase().includes(q)
            );
        }

        // Filtro por tipo
        if (f.tipo) {
            resultado = resultado.filter(hab => hab.tipo === f.tipo);
        }

        // Rango de precio
        if (f.min !== '') {
            resultado = resultado.filter(hab => Number(hab.precio_noche) >= Number(f.min));
        }
        if (f.max !== '') {
            resultado = resultado.filter(hab => Number(hab.precio_noche) <= Number(f.max));
        }

        // Ordenamiento
        resultado.sort((a, b) => {
            switch (f.sort) {
                case 'precio_desc': return Number(b.precio_noche) - Number(a.precio_noche);
                case 'tipo': return (a.tipo || '').localeCompare(b.tipo || '');
                default: return Number(a.precio_noche) - Number(b.precio_noche); // precio_asc
            }
        });

        return resultado;
    };

    const resultados = buscarHabitaciones(habitacionesDisponibles, filtrosAplicados);

    const hayFiltrosActivos = Object.entries(filtrosAplicados).some(
        ([k, v]) => v !== '' && v !== FILTROS_VACIOS[k]
    );

    const aplicarBusqueda = () => {
        setFiltrosAplicados({ ...filtros });
        const resultadosBusqueda = buscarHabitaciones(habitacionesDisponibles, filtros);
        console.log('%c🔍 Resultados de búsqueda:', 'color: #4f8ef7; font-weight: bold; font-size: 13px;');
        console.log(JSON.stringify(resultadosBusqueda, null, 2));
    };

    const limpiarFiltros = () => {
        setFiltros(FILTROS_VACIOS);
        setFiltrosAplicados(FILTROS_VACIOS);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') aplicarBusqueda();
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

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content">
                        <h2 className="hero-title">Bienvenido a HotelFlow</h2>
                        <p className="hero-subtitle">Experiencia de hospedaje premium para viajeros de negocios y placer</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
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

            {/* Rooms Section con Búsqueda */}
            <section id="habitaciones" className="rooms">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Encuentra tu Habitación Ideal</h2>
                        <p className="section-subtitle">Filtra por tipo y precio para encontrar la mejor opción</p>
                    </div>

                    {/* ── BUSCADOR ── */}
                    <div className="search-box-client">
                        <div className="search-simple-row">
                            <div className="search-input-wrap">
                                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Buscar por tipo o amenidades…"
                                    value={filtros.q}
                                    onChange={(e) => setFiltros({ ...filtros, q: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                />
                                {filtros.q && (
                                    <button className="search-clear-btn" onClick={() => setFiltros({ ...filtros, q: '' })}>×</button>
                                )}
                            </div>

                            <button className="btn-primary" onClick={aplicarBusqueda}>
                                Buscar
                            </button>

                            <button
                                className={`btn-filter-toggle ${panelAbierto ? 'active' : ''}`}
                                onClick={() => setPanelAbierto(!panelAbierto)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                </svg>
                                Filtros
                                {hayFiltrosActivos && <span className="filter-dot"></span>}
                            </button>

                            {hayFiltrosActivos && (
                                <button className="btn-clear-all" onClick={limpiarFiltros}>
                                    ✕ Limpiar
                                </button>
                            )}
                        </div>

                        {/* Panel avanzado */}
                        {panelAbierto && (
                            <div className="search-advanced-panel">
                                <div className="search-advanced-grid-client">
                                    <div className="search-field">
                                        <label>Tipo de habitación</label>
                                        <select
                                            className="form-input"
                                            value={filtros.tipo}
                                            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                                        >
                                            <option value="">Todas</option>
                                            <option value="Individual">Individual</option>
                                            <option value="Doble">Doble</option>
                                            <option value="Suite">Suite</option>
                                            <option value="Suite Ejecutiva">Suite Ejecutiva</option>
                                        </select>
                                    </div>

                                    <div className="search-field">
                                        <label>Rango de precio / noche</label>
                                        <div className="search-price-row">
                                            <input
                                                type="number"
                                                className="form-input"
                                                placeholder="$ Mín"
                                                min="0"
                                                value={filtros.min}
                                                onChange={(e) => setFiltros({ ...filtros, min: e.target.value })}
                                            />
                                            <span className="price-sep">–</span>
                                            <input
                                                type="number"
                                                className="form-input"
                                                placeholder="$ Máx"
                                                min="0"
                                                value={filtros.max}
                                                onChange={(e) => setFiltros({ ...filtros, max: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="search-field">
                                        <label>Ordenar por</label>
                                        <select
                                            className="form-input"
                                            value={filtros.sort}
                                            onChange={(e) => setFiltros({ ...filtros, sort: e.target.value })}
                                        >
                                            <option value="precio_asc">Precio: Menor a Mayor</option>
                                            <option value="precio_desc">Precio: Mayor a Menor</option>
                                            <option value="tipo">Tipo de Habitación</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="search-advanced-footer">
                                    <button className="btn-secondary" onClick={limpiarFiltros}>
                                        Limpiar
                                    </button>
                                    <button className="btn-primary" onClick={aplicarBusqueda}>
                                        Aplicar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── RESULTADOS ── */}
                    {loading && (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Cargando habitaciones...</p>
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                            <button className="btn-primary" onClick={cargarHabitaciones}>Reintentar</button>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            <div className="search-results-info">
                                {hayFiltrosActivos ? (
                                    <p>
                                        <strong>{resultados.length}</strong> habitación{resultados.length !== 1 ? 'es' : ''} disponible{resultados.length !== 1 ? 's' : ''}
                                        {filtrosAplicados.q && <> para <em>"{filtrosAplicados.q}"</em></>}
                                    </p>
                                ) : (
                                    <p><strong>{resultados.length}</strong> habitaciones disponibles</p>
                                )}
                            </div>

                            {resultados.length === 0 ? (
                                <div className="empty-state">
                                    <h3>No se encontraron habitaciones</h3>
                                    <p>Intenta ajustar los filtros de búsqueda</p>
                                    {hayFiltrosActivos && (
                                        <button className="btn-primary" onClick={limpiarFiltros} style={{ marginTop: '1rem' }}>
                                            Ver todas las habitaciones
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="rooms-grid">
                                    {resultados.map(hab => {
                                        const images = roomImages[hab.tipo] || roomImages['Individual'];
                                        const currentIndex = currentImages[hab.id] || 0;

                                        return (
                                            <article key={hab.id} className="room-card">
                                                {/* Carrusel de imágenes */}
                                                <div className="room-carousel">
                                                    <img
                                                        src={images[currentIndex]}
                                                        alt={`${hab.tipo} - Imagen ${currentIndex + 1}`}
                                                        className="room-carousel-image"
                                                    />

                                                    {/* Botones de navegación */}
                                                    <button
                                                        className="carousel-btn carousel-btn-prev"
                                                        onClick={() => prevImage(hab.id, hab.tipo)}
                                                        aria-label="Imagen anterior"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <polyline points="15 18 9 12 15 6"></polyline>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="carousel-btn carousel-btn-next"
                                                        onClick={() => nextImage(hab.id, hab.tipo)}
                                                        aria-label="Siguiente imagen"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <polyline points="9 18 15 12 9 6"></polyline>
                                                        </svg>
                                                    </button>

                                                    {/* Indicadores de puntos */}
                                                    <div className="carousel-dots">
                                                        {images.map((_, index) => (
                                                            <button
                                                                key={index}
                                                                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                                                                onClick={() => goToImage(hab.id, index)}
                                                                aria-label={`Ir a imagen ${index + 1}`}
                                                            />
                                                        ))}
                                                    </div>

                                                    {/* Badges */}
                                                    <div className="room-badge">Disponible</div>
                                                    <div className="room-price">
                                                        <span className="price-amount">${hab.precio_noche}</span>
                                                        <span className="price-period">/noche</span>
                                                    </div>
                                                </div>

                                                <div className="room-content">
                                                    <h3 className="room-title">{hab.tipo}</h3>
                                                    <p className="room-description">
                                                        Habitación {hab.num_ha} en el piso {hab.piso}. {hab.amenidades || 'Todas las comodidades para su estadía.'}
                                                    </p>
                                                    <div className="room-amenities">
                                                        <div className="amenity">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                                <circle cx="9" cy="7" r="4"></circle>
                                                            </svg>
                                                            <span>Confortable</span>
                                                        </div>
                                                        <div className="amenity">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <path d="M2 4v16"></path>
                                                                <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
                                                            </svg>
                                                            <span>Hab. {hab.num_ha}</span>
                                                        </div>
                                                    </div>
                                                    <button className="btn-reserve">Reservar Ahora</button>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}

                    {/* ── PAGINACIÓN ── */}
                    {totalPaginas > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '2rem', paddingBottom: '1rem' }}>
                            <button
                                className="btn-outline"
                                onClick={() => cambiarPagina(paginaActual - 1)}
                                disabled={paginaActual <= 1}
                                style={{ opacity: paginaActual <= 1 ? 0.4 : 1 }}
                            >
                                ← Anterior
                            </button>
                            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                Página <strong>{paginaActual}</strong> de <strong>{totalPaginas}</strong>
                                &nbsp;·&nbsp; {totalHabitaciones} habitaciones en total
                            </span>
                            <button
                                className="btn-outline"
                                onClick={() => cambiarPagina(paginaActual + 1)}
                                disabled={paginaActual >= totalPaginas}
                                style={{ opacity: paginaActual >= totalPaginas ? 0.4 : 1 }}
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-section">
                            <h3>HotelFlow</h3>
                            <p>Sistema de reservaciones en línea para hoteles de categoría premium.</p>
                        </div>
                        <div className="footer-section">
                            <h4>Contacto</h4>
                            <p>Email: reservas@hotelflow.com</p>
                            <p>Tel: +1 (555) 123-4567</p>
                            <p>Soporte 24/7</p>
                        </div>
                        <div className="footer-section">
                            <h4>Horarios</h4>
                            <p>Check-in: 3:00 PM</p>
                            <p>Check-out: 12:00 PM</p>
                            <p>Recepción: 24 horas</p>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 HotelFlow. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>


        </div>
    );
};

export default ClientDashboard;