import React, { useEffect, useState } from 'react';
import '../styles/ClientStyles.css';
import '../styles/scroll-animations.css';
import '../styles/carousel-transition.css';

import { obtenerHabitaciones } from "../api/habitacionesService";
import { crearReservacion, obtenerMisReservaciones, cancelarReservacion } from "../api/reservacionesService";
import Header from "../components/layout/Header";
import Hero from '../components/layout/Hero';
import Features from '../components/layout/Features';
import RoomsSection from "../components/rooms/RoomsSection";
import ReservaModal from "../components/rooms/ReservaModal";
import Footer from "../components/layout/Footer";
import { roomImages } from "../constants/roomImages";

import useRoomCarousel from '../hooks/useRoomCarousel';
import useScrollAnimation from '../hooks/useScrollAnimation';

const ClientDashboard = () => {
    const [usuario, setUsuario] = useState(null);
    const [habitaciones, setHabitaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buscando, setBuscando] = useState(false);
    const [errorBusqueda, setErrorBusqueda] = useState(null);

    // Paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [totalHabitaciones, setTotalHabitaciones] = useState(0);
    const LIMIT = 10;

    // Modal de reserva
    const [modalReservaAbierto, setModalReservaAbierto] = useState(false);
    const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);

    // Mis reservaciones
    const [misReservaciones, setMisReservaciones] = useState([]);
    const [cargandoReservas, setCargandoReservas] = useState(false);

    // Filtros
    const FILTROS_VACIOS = { q: '', tipo: '', min: '', max: '', sort: 'precio_asc' };
    const [filtros, setFiltros] = useState(FILTROS_VACIOS);
    const [filtrosAplicados, setFiltrosAplicados] = useState(FILTROS_VACIOS);
    const [panelAbierto, setPanelAbierto] = useState(false);
    const hayFiltrosActivos = filtros.q || filtros.tipo || filtros.min || filtros.max;

    // Carrusel con fade
    const { currentImages, fadingImages, nextImage, prevImage, goToImage, setCurrentImages }
        = useRoomCarousel(roomImages);

    // Scroll animations — threshold 0 para activarse en cuanto entra al viewport
    const [refHero,     visibleHero]     = useScrollAnimation(0);
    const [refRooms,    visibleRooms]    = useScrollAnimation(0);
    const [refReservas, visibleReservas] = useScrollAnimation(0);

    useEffect(() => {
        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) {
            const u = JSON.parse(usuarioData);
            setUsuario(u);
            cargarMisReservaciones(u.id);
        }
        cargarHabitaciones();
    }, []);

    const cargarHabitaciones = async (pagina = 1) => {
        try {
            setLoading(true);
            const response = await obtenerHabitaciones({ page: pagina, limit: LIMIT });
            const { datos, total, pagina: pag, totalPaginas: tp } = response;
            setHabitaciones(datos);
            setPaginaActual(pag);
            setTotalPaginas(tp);
            setTotalHabitaciones(total);
            const initialImages = {};
            datos.forEach(hab => { initialImages[hab.id] = 0; });
            setCurrentImages(initialImages);
            setError(null);
        } catch (error) {
            console.error('Error cargando habitaciones:', error);
            setError('No se pudieron cargar las habitaciones');
        } finally {
            setLoading(false);
        }
    };

    const cargarMisReservaciones = async (idUsuario) => {
        if (!idUsuario) return;
        try {
            setCargandoReservas(true);
            const data = await obtenerMisReservaciones(idUsuario);
            setMisReservaciones(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Error cargando mis reservaciones:', e);
        } finally {
            setCargandoReservas(false);
        }
    };

    const handleReservar = (hab) => {
        if (!usuario) { alert("Debes iniciar sesión para reservar."); return; }
        setHabitacionSeleccionada(hab);
        setModalReservaAbierto(true);
    };

    const handleConfirmarReserva = async (datos) => {
        const resultado = await crearReservacion(datos);
        if (resultado.exito) {
            setModalReservaAbierto(false);
            setHabitacionSeleccionada(null);
            alert(`✅ ¡Reservación confirmada! Tu habitación queda reservada del ${datos.fecha_entrada} al ${datos.fecha_salida}.`);
            cargarHabitaciones(paginaActual);
            cargarMisReservaciones(usuario.id);
        } else {
            throw new Error(resultado.mensaje || "Error al reservar");
        }
    };

    const handleCancelarReserva = async (id) => {
        if (!window.confirm("¿Estás seguro de cancelar esta reservación?")) return;
        try {
            const resultado = await cancelarReservacion(id);
            if (resultado.exito) {
                alert("Reservación cancelada.");
                cargarMisReservaciones(usuario.id);
                cargarHabitaciones(paginaActual);
            }
        } catch (e) {
            alert("Error al cancelar la reservación.");
        }
    };

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
        cargarHabitaciones(nuevaPagina);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const aplicarBusqueda = async () => {
        try {
            setBuscando(true);
            setErrorBusqueda(null);
            const resultado = await obtenerHabitaciones({ ...filtros, page: 1, limit: LIMIT });
            setHabitaciones(resultado.datos);
            setPaginaActual(resultado.pagina);
            setTotalPaginas(resultado.totalPaginas);
            setTotalHabitaciones(resultado.total);
        } catch (err) {
            setErrorBusqueda("Error al buscar habitaciones");
        } finally {
            setBuscando(false);
        }
    };

    const limpiarFiltros = () => {
        setFiltros(FILTROS_VACIOS);
        setFiltrosAplicados(FILTROS_VACIOS);
    };

    const handleKeyDown = (e) => { if (e.key === 'Enter') aplicarBusqueda(); };

    const cerrarSesion = () => {
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    };

    const estadoColor = {
        "Confirmada": { bg: "#dcfce7", color: "#16a34a" },
        "Check-in":   { bg: "#dbeafe", color: "#1d4ed8" },
        "Check-out":  { bg: "#f3f4f6", color: "#6b7280" },
        "Cancelada":  { bg: "#fee2e2", color: "#dc2626" }
    };

    return (
        <div>
            <Header usuario={usuario} cerrarSesion={cerrarSesion} />

            {/* HERO — fade-in al entrar al viewport */}
            <div ref={refHero} className={`fade-in-section ${visibleHero ? 'is-visible' : ''}`}>
                <Hero />
            </div>

            <Features />

            {/* ROOMS — fade-in al hacer scroll */}
            <div ref={refRooms} className={`fade-in-section ${visibleRooms ? 'is-visible' : ''}`}>
                <RoomsSection
                    habitaciones={habitaciones}
                    loading={loading}
                    error={error}
                    buscando={buscando}
                    errorBusqueda={errorBusqueda}
                    filtros={filtros}
                    setFiltros={setFiltros}
                    aplicarBusqueda={aplicarBusqueda}
                    limpiarFiltros={limpiarFiltros}
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    cambiarPagina={cambiarPagina}
                    roomImages={roomImages}
                    currentImages={currentImages}
                    fadingImages={fadingImages}
                    prevImage={prevImage}
                    nextImage={nextImage}
                    goToImage={goToImage}
                    totalHabitaciones={totalHabitaciones}
                    panelAbierto={panelAbierto}
                    setPanelAbierto={setPanelAbierto}
                    hayFiltrosActivos={hayFiltrosActivos}
                    handleKeyDown={handleKeyDown}
                    cargarHabitaciones={cargarHabitaciones}
                    onReservar={handleReservar}
                />
            </div>

            {/* MIS RESERVACIONES — fade-in al hacer scroll */}
            {usuario && (
                <section
                    ref={refReservas}
                    className={`fade-in-section ${visibleReservas ? 'is-visible' : ''}`}
                    style={{ padding: "3rem 0", background: "#f8fafc" }}
                >
                    <div className="container">
                        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.6rem", color: "#1e293b" }}>
                            Mis Reservaciones
                        </h2>

                        {cargandoReservas && <p style={{ color: "#64748b" }}>Cargando reservaciones...</p>}

                        {!cargandoReservas && misReservaciones.length === 0 && (
                            <div style={{
                                textAlign: "center", padding: "2rem",
                                background: "white", borderRadius: 12,
                                border: "1px dashed #cbd5e1", color: "#94a3b8"
                            }}>
                                <p style={{ fontSize: "1.1rem" }}>No tienes reservaciones aún.</p>
                                <p>Explora las habitaciones arriba y haz tu primera reserva.</p>
                            </div>
                        )}

                        {!cargandoReservas && misReservaciones.length > 0 && (
                            <div style={{ display: "grid", gap: "1rem" }}>
                                {misReservaciones
                                    .sort((a, b) => (b.creado_en || '').localeCompare(a.creado_en || ''))
                                    .map(reserva => {
                                        const estiloEstado = estadoColor[reserva.estado_reserva] || { bg: "#f3f4f6", color: "#6b7280" };
                                        return (
                                            <div key={reserva.id} style={{
                                                background: "white", borderRadius: 12,
                                                padding: "1.25rem 1.5rem",
                                                boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                                                display: "flex", justifyContent: "space-between",
                                                alignItems: "center", flexWrap: "wrap", gap: "1rem"
                                            }}>
                                                <div>
                                                    <strong style={{ fontSize: "1rem", color: "#1e293b" }}>
                                                        Habitación {reserva.num_hab}
                                                    </strong>
                                                    <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.9rem" }}>
                                                        📅 {reserva.fecha_entrada} → {reserva.fecha_salida}
                                                        &nbsp;&nbsp;·&nbsp;&nbsp;
                                                        👤 {reserva.num_huespedes} huésped{reserva.num_huespedes !== 1 ? 'es' : ''}
                                                    </p>
                                                    {reserva.notas && (
                                                        <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "0.82rem" }}>
                                                            📝 {reserva.notas}
                                                        </p>
                                                    )}
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                    <div style={{ textAlign: "right" }}>
                                                        <strong style={{ color: "#1e293b", fontSize: "1.1rem" }}>
                                                            ${reserva.total?.toFixed(2) || "0.00"}
                                                        </strong>
                                                        <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8" }}>total</p>
                                                    </div>
                                                    <span style={{
                                                        padding: "4px 12px", borderRadius: 20,
                                                        fontSize: "0.82rem", fontWeight: 600,
                                                        background: estiloEstado.bg, color: estiloEstado.color
                                                    }}>
                                                        {reserva.estado_reserva}
                                                    </span>
                                                    {reserva.estado_reserva === "Confirmada" && (
                                                        <button
                                                            className="btn-secondary"
                                                            style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                                                            onClick={() => handleCancelarReserva(reserva.id)}
                                                        >
                                                            Cancelar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Modal de reserva */}
            {modalReservaAbierto && habitacionSeleccionada && (
                <ReservaModal
                    hab={habitacionSeleccionada}
                    usuario={usuario}
                    onClose={() => { setModalReservaAbierto(false); setHabitacionSeleccionada(null); }}
                    onConfirmar={handleConfirmarReserva}
                />
            )}

            <Footer />
        </div>
    );
};

export default ClientDashboard;
 