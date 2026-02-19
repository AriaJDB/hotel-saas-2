import React from "react";
import RoomCard from "../RoomCard";

const RoomsSection = ({
    habitaciones,
    loading,
    error,
    buscando,
    errorBusqueda,
    filtros,
    setFiltros,
    aplicarBusqueda,
    limpiarFiltros,
    paginaActual,
    totalPaginas,
    cambiarPagina,

    roomImages,
    currentImages,
    prevImage,
    nextImage,
    goToImage,
    totalHabitaciones,
    panelAbierto,
    setPanelAbierto,
    hayFiltrosActivos,
    handleKeyDown,
    cargarHabitaciones
}) => {



    return (
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
                                    <strong>{habitaciones.length}</strong> habitación{habitaciones.length !== 1 ? 'es' : ''} disponible{habitaciones.length !== 1 ? 's' : ''}
                                    {filtros.q && <> para <em>"{filtros.q}"</em></>}
                                </p>
                            ) : (
                                <p><strong>{habitaciones.length}</strong> habitaciones disponibles</p>
                            )}

                        </div>

                        {buscando && (
                            <div className="loading-container loading-centered">
                                <div className="loading-row">
                                    <div className="loading-spinner"></div>
                                    <span className="loading-text">Buscando...</span>
                                </div>
                            </div>
                        )}


                        {errorBusqueda && (
                            <div className="error-message">
                                <p><strong>Error:</strong> {errorBusqueda}</p>
                            </div>
                        )}


                        {!buscando && !errorBusqueda && habitaciones.length === 0 ? (


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
                                {habitaciones.map(hab => (
                                    <RoomCard
                                        key={hab.id}
                                        hab={hab}
                                        roomImages={roomImages}
                                        currentImages={currentImages}
                                        prevImage={prevImage}
                                        nextImage={nextImage}
                                        goToImage={goToImage}
                                    />
                                ))}


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
    );
};

export default RoomsSection;
