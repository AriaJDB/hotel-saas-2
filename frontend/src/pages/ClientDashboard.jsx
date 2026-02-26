import React, { useEffect, useState } from 'react';
import '../styles/ClientStyles.css';
import { obtenerHabitaciones } from "../api/habitacionesService";
import Header from "../components/layout/Header";
import Hero from '../components/layout/Hero';
import Features from '../components/layout/Features';
import RoomsSection from "../components/rooms/RoomsSection";
import Footer from "../components/layout/Footer";
import { roomImages } from "../constants/roomImages";
import { useRoomCarousel } from '../hooks/useRoomCarousel';

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


    useEffect(() => {
        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) setUsuario(JSON.parse(usuarioData));
        cargarHabitaciones();
    }, []);

    const cargarHabitaciones = async (pagina = 1) => {
        try {
            setLoading(true);
            const response = await obtenerHabitaciones({
                page: pagina,
                limit: LIMIT
            });

            const { datos, total, pagina: pag, totalPaginas: tp } = response;

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
            console.log(JSON.stringify(response, null, 2));

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


    // Funciones del carrusel
    const {
        currentImages,
        nextImage,
        prevImage,
        goToImage,
        setCurrentImages
    } = useRoomCarousel(roomImages);

    const cerrarSesion = () => {
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    };

    const FILTROS_VACIOS = { q: '', tipo: '', min: '', max: '', sort: 'precio_asc' };
    const [filtros, setFiltros] = useState(FILTROS_VACIOS);
    const [filtrosAplicados, setFiltrosAplicados] = useState(FILTROS_VACIOS);
    const [panelAbierto, setPanelAbierto] = useState(false);

    const hayFiltrosActivos =
        filtros.q || filtros.tipo || filtros.min || filtros.max;

    const aplicarBusqueda = async () => {
        try {
            setBuscando(true);
            setErrorBusqueda(null);

            const resultado = await obtenerHabitaciones({
                ...filtros,
                page: 1,
                limit: LIMIT
            });

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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') aplicarBusqueda();
    };

    return (
        <div>
            {/* Header */}
            <Header usuario={usuario} cerrarSesion={cerrarSesion} />

            {/* Hero Section, esto es la imagen de Bienvenido a hotel flow y lo movi a src>components>layout>hero */}
            <Hero />
            {/* Features Section, estas son las cajitas que dicen multiples ubicaciones, confirmacion inmediata y asi, las movi a  src>components>layout>features*/}
            <Features />

            {/* Rooms Section con Búsqueda esta es toda la parte de encuentra tu habitacion ideal, el filtro y las imagenes de las habitaciones, lo movi a src>components>rooms>RoomsSection, y las imagenes estan en RoomCard, roomsSection llama a RoomCard y asi*/}
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
                prevImage={prevImage}
                nextImage={nextImage}
                goToImage={goToImage}
                totalHabitaciones={totalHabitaciones}
                panelAbierto={panelAbierto}
                setPanelAbierto={setPanelAbierto}
                hayFiltrosActivos={hayFiltrosActivos}
                handleKeyDown={handleKeyDown}
                cargarHabitaciones={cargarHabitaciones}
            />


            {/* Footer, esto es lo de hasta abajito de los horarios contacto y eso, lo movi a src>components>layout>footer*/}
            <Footer />

        </div>
    );
};

export default ClientDashboard;