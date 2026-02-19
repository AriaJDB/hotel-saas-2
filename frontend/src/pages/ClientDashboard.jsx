import React, { useEffect, useState } from 'react';
import '../styles/ClientStyles.css';
import { obtenerHabitaciones } from "../api/habitacionesService";
import Header from "../components/layout/Header";
import Hero from '../components/layout/Hero';
import Features from '../components/layout/Features';
import RoomsSection from "../components/rooms/RoomsSection";
import Footer from "../components/layout/Footer";

const ClientDashboard = () => {
    const [usuario, setUsuario] = useState(null);
    const [habitaciones, setHabitaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImages, setCurrentImages] = useState({});
    // NUEVOS ESTADOS PARA ANIMACIÓN DE BÚSQUEDA
    const [buscando, setBuscando] = useState(false);
    const [errorBusqueda, setErrorBusqueda] = useState(null);


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

            {/* Hero Section */}
            <Hero />
            {/* Features Section */}
            <Features />

            {/* Rooms Section con Búsqueda */}
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


            {/* Footer */}
            <Footer />

        </div>
    );
};

export default ClientDashboard;