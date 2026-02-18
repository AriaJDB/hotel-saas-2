import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminStyles.css';

// ========== COMPONENTE BUSCADOR (fuera del componente principal para evitar re-renders) ==========
const Buscador = ({ valor, onChange, placeholder }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '8px', padding: '8px 12px', minWidth: '260px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
            type="text"
            value={valor}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.875rem', color: '#334155', width: '100%' }}
        />
        {valor && (
            <button
                onClick={() => onChange('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1, padding: 0 }}
            >×</button>
        )}
    </div>
);

const AdminDashboard = () => {
    const [usuario, setUsuario] = useState(null);
    const [habitaciones, setHabitaciones] = useState([]);
    const [reservaciones, setReservaciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [articulos, setArticulos] = useState([]);
    const [pedidos, setPedidos] = useState([]);

    // Estados para modales
    const [modalAbierto, setModalAbierto] = useState(false);
    const [tipoModal, setTipoModal] = useState('');
    const [modoModal, setModoModal] = useState('crear');
    const [itemSeleccionado, setItemSeleccionado] = useState(null);

    // ========== BUSCADORES ==========
    const [busquedaHabitaciones, setBusquedaHabitaciones] = useState('');
    const [busquedaReservaciones, setBusquedaReservaciones] = useState('');
    const [busquedaUsuarios, setBusquedaUsuarios] = useState('');
    const [busquedaArticulos, setBusquedaArticulos] = useState('');

    // Estados para formularios
    const [formHabitacion, setFormHabitacion] = useState({
        num_ha: '',
        piso: '',
        tipo: 'Individual',
        precio_noche: '',
        amenidades: [],
        estado: 'Disponible',
        ultima_lim: '',
        id_em: ''
    });

    const [nuevaAmenidad, setNuevaAmenidad] = useState('');

    const [formReservacion, setFormReservacion] = useState({
        id_usuario: '',
        num_ha: '',
        fecha_entrada: '',
        fecha_salida: '',
        num_huespedes: 1,
        metodo_pago: 'Tarjeta',
        estado_reserva: 'Pendiente',
        pendiente_pago: 0,
        total: 0,
        notas: ''
    });

    const [formUsuario, setFormUsuario] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        telefono: '',
        password: '',
        tipo: 'usuario'
    });

    const [formArticulo, setFormArticulo] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: 'Restaurante',
        disponibilidad: 'Disponible'
    });

    const [vistaActual, setVistaActual] = useState('dashboard');

    useEffect(() => {
        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) {
            setUsuario(JSON.parse(usuarioData));
        }
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [habRes, resRes, usuRes, artRes, pedRes] = await Promise.all([
                axios.get('http://localhost:3000/habitaciones'),
                axios.get('http://localhost:3000/reservaciones'),
                axios.get('http://localhost:3000/usuarios'),
                axios.get('http://localhost:3000/articulos'),
                axios.get('http://localhost:3000/pedidos')
            ]);
            // /habitaciones devuelve { datos, total, pagina, ... } (paginado)
            const habData = habRes.data;
            setHabitaciones(Array.isArray(habData) ? habData : (Array.isArray(habData?.datos) ? habData.datos : []));
            setReservaciones(Array.isArray(resRes.data) ? resRes.data : (Array.isArray(resRes.data?.datos) ? resRes.data.datos : []));
            setUsuarios(Array.isArray(usuRes.data) ? usuRes.data : (Array.isArray(usuRes.data?.datos) ? usuRes.data.datos : []));
            setArticulos(Array.isArray(artRes.data) ? artRes.data : (Array.isArray(artRes.data?.datos) ? artRes.data.datos : []));
            setPedidos(Array.isArray(pedRes.data) ? pedRes.data : (Array.isArray(pedRes.data?.datos) ? pedRes.data.datos : []));
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    };

    // ========== FILTROS EN MEMORIA ==========
    const habitacionesFiltradas = habitaciones.filter(hab => {
        const q = busquedaHabitaciones.toLowerCase();
        const amenidadesTexto = Array.isArray(hab.amenidades)
            ? hab.amenidades.join(', ').toLowerCase()
            : (hab.amenidades || '').toLowerCase();
        return (
            String(hab.num_ha).includes(q) ||
            (hab.tipo || '').toLowerCase().includes(q) ||
            (hab.estado || '').toLowerCase().includes(q) ||
            amenidadesTexto.includes(q)
        );
    });

    const reservacionesFiltradas = reservaciones.filter(res => {
        const q = busquedaReservaciones.toLowerCase();
        return (
            String(res.id || '').includes(q) ||
            String(res.num_ha || '').includes(q) ||
            (res.id_usuario || '').toLowerCase().includes(q) ||
            (res.estado_reserva || '').toLowerCase().includes(q) ||
            (res.fecha_entrada || '').includes(q)
        );
    });

    const usuariosFiltrados = usuarios.filter(user => {
        const q = busquedaUsuarios.toLowerCase();
        return (
            (user.nombre || '').toLowerCase().includes(q) ||
            (user.apellidos || '').toLowerCase().includes(q) ||
            (user.correo || '').toLowerCase().includes(q) ||
            (user.tipo || '').toLowerCase().includes(q) ||
            (user.telefono || '').includes(q)
        );
    });

    const articulosFiltrados = articulos.filter(art => {
        const q = busquedaArticulos.toLowerCase();
        return (
            (art.nombre || '').toLowerCase().includes(q) ||
            (art.descripcion || '').toLowerCase().includes(q) ||
            (art.categoria || '').toLowerCase().includes(q) ||
            (art.disponibilidad || '').toLowerCase().includes(q)
        );
    });

    useEffect(() => {
        if (busquedaHabitaciones) {
            console.log('%c[Admin] Habitaciones filtradas:', 'color: #6366f1; font-weight: bold; font-size: 13px;');
            console.log(JSON.stringify(habitacionesFiltradas, null, 2));
        }
    }, [busquedaHabitaciones, habitaciones]);

    useEffect(() => {
        if (busquedaReservaciones) {
            console.log('%c[Admin] Reservaciones filtradas:', 'color: #f59e0b; font-weight: bold; font-size: 13px;');
            console.log(JSON.stringify(reservacionesFiltradas, null, 2));
        }
    }, [busquedaReservaciones, reservaciones]);

    useEffect(() => {
        if (busquedaUsuarios) {
            console.log('%c[Admin] Usuarios filtrados:', 'color: #10b981; font-weight: bold; font-size: 13px;');
            console.log(JSON.stringify(usuariosFiltrados, null, 2));
        }
    }, [busquedaUsuarios, usuarios]);

    useEffect(() => {
        if (busquedaArticulos) {
            console.log('%c[Admin] Artículos filtrados:', 'color: #ef4444; font-weight: bold; font-size: 13px;');
            console.log(JSON.stringify(articulosFiltrados, null, 2));
        }
    }, [busquedaArticulos, articulos]);

    const abrirModalHabitacion = (modo, habitacion = null) => {
        setTipoModal('habitacion');
        setModoModal(modo);
        setNuevaAmenidad('');
        if (habitacion) {
            setFormHabitacion({
                ...habitacion,
                num_ha: habitacion.num,
                amenidades: habitacion.amenidades || []
            });
            setItemSeleccionado(habitacion);
        } else {
            setFormHabitacion({
                num_ha: '',
                piso: '',
                tipo: 'Individual',
                precio_noche: '',
                amenidades: [],
                estado: 'Libre',
                ultima_lim: '',
                id_em: ''
            });
        }
        setModalAbierto(true);
    };

    const guardarHabitacion = async () => {
        try {
            if (modoModal === 'crear') {
                await axios.post('http://localhost:3000/habitaciones/nueva', formHabitacion);
            } else {
                await axios.put(`http://localhost:3000/habitaciones/${itemSeleccionado.id}`, formHabitacion);
            }
            cargarDatos();
            cerrarModal();
            alert('Habitación guardada con éxito');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la solicitud');
        }
    };

    const eliminarHabitacion = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta habitación?')) {
            try {
                await axios.delete(`http://localhost:3000/habitaciones/${id}`);
                cargarDatos();
                alert('Habitación eliminada exitosamente');
            } catch (error) {
                console.error('Error eliminando habitación:', error);
                alert('Error al eliminar habitación');
            }
        }
    };

    const agregarAmenidad = () => {
        if (nuevaAmenidad.trim() !== '') {
            setFormHabitacion({
                ...formHabitacion,
                amenidades: [...(formHabitacion.amenidades || []), nuevaAmenidad.trim()]
            });
            setNuevaAmenidad('');
        }
    };

    const eliminarAmenidad = (indexAEliminar) => {
        setFormHabitacion({
            ...formHabitacion,
            amenidades: formHabitacion.amenidades.filter((_, index) => index !== indexAEliminar)
        });
    };

    const abrirModalReservacion = (modo, reservacion = null) => {
        setTipoModal('reservacion');
        setModoModal(modo);
        if (reservacion) {
            setFormReservacion(reservacion);
            setItemSeleccionado(reservacion);
        } else {
            setFormReservacion({
                id_usuario: '',
                num_ha: '',
                fecha_entrada: '',
                fecha_salida: '',
                num_huespedes: 1,
                metodo_pago: 'Tarjeta',
                estado_reserva: 'Pendiente',
                pendiente_pago: 0,
                total: 0,
                notas: ''
            });
        }
        setModalAbierto(true);
    };

    const guardarReservacion = async () => {
        try {
            if (modoModal === 'crear') {
                await axios.post('http://localhost:3000/reservaciones', formReservacion);
            } else {
                await axios.put(`http://localhost:3000/reservaciones/${itemSeleccionado.id}`, formReservacion);
            }
            cargarDatos();
            cerrarModal();
            alert('Reservación guardada exitosamente');
        } catch (error) {
            console.error('Error guardando reservación:', error);
            alert('Error al guardar reservación');
        }
    };

    const eliminarReservacion = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta reservación?')) {
            try {
                await axios.delete(`http://localhost:3000/reservaciones/${id}`);
                cargarDatos();
                alert('Reservación eliminada exitosamente');
            } catch (error) {
                console.error('Error eliminando reservación:', error);
                alert('Error al eliminar reservación');
            }
        }
    };

    const abrirModalUsuario = (modo, usuario = null) => {
        setTipoModal('usuario');
        setModoModal(modo);
        if (usuario) {
            setFormUsuario(usuario);
            setItemSeleccionado(usuario);
        } else {
            setFormUsuario({
                nombre: '',
                apellidos: '',
                correo: '',
                telefono: '',
                password: '',
                tipo: 'usuario'
            });
        }
        setModalAbierto(true);
    };

    const guardarUsuario = async () => {
        try {
            if (modoModal === 'crear') {
                await axios.post('http://localhost:3000/usuarios', formUsuario);
            } else {
                await axios.put(`http://localhost:3000/usuarios/${itemSeleccionado.id}`, formUsuario);
            }
            cargarDatos();
            cerrarModal();
            alert('Usuario guardado exitosamente');
        } catch (error) {
            console.error('Error guardando usuario:', error);
            alert('Error al guardar usuario');
        }
    };

    const eliminarUsuario = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await axios.delete(`http://localhost:3000/usuarios/${id}`);
                cargarDatos();
                alert('Usuario eliminado exitosamente');
            } catch (error) {
                console.error('Error eliminando usuario:', error);
                alert('Error al eliminar usuario');
            }
        }
    };

    // ========== FUNCIONES CRUD ARTÍCULOS ==========
    const abrirModalArticulo = (modo, articulo = null) => {
        setTipoModal('articulo');
        setModoModal(modo);
        if (articulo) {
            setFormArticulo(articulo);
            setItemSeleccionado(articulo);
        } else {
            setFormArticulo({
                nombre: '',
                descripcion: '',
                precio: '',
                categoria: 'Restaurante',
                disponibilidad: 'Disponible'
            });
        }
        setModalAbierto(true);
    };

    const guardarArticulo = async () => {
        try {
            if (modoModal === 'crear') {
                await axios.post('http://localhost:3000/articulos', formArticulo);
            } else {
                await axios.put(`http://localhost:3000/articulos/${itemSeleccionado.id}`, formArticulo);
            }
            cargarDatos();
            cerrarModal();
            alert('Artículo guardado exitosamente');
        } catch (error) {
            console.error('Error guardando artículo:', error);
            alert('Error al guardar artículo');
        }
    };

    const eliminarArticulo = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este artículo?')) {
            try {
                await axios.delete(`http://localhost:3000/articulos/${id}`);
                cargarDatos();
                alert('Artículo eliminado exitosamente');
            } catch (error) {
                console.error('Error eliminando artículo:', error);
                alert('Error al eliminar artículo');
            }
        }
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setTipoModal('');
        setModoModal('crear');
        setItemSeleccionado(null);
    };

    // ========== CALCULOS ESTADISTICAS ==========
    const habitacionesDisponibles = habitaciones.filter(h => h.estado === 'Disponible').length;
    const reservacionesActivas = reservaciones.filter(r => r.estado_reserva === 'Confirmada').length;
    const ingresosTotales = reservaciones.reduce((sum, r) => sum + (r.total || 0), 0);

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
            </header>

            {/* VISTA DASHBOARD */}
            {vistaActual === 'dashboard' && (
                <section id="dashboard" className="dashboard-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Panel de Control</h2>
                            <p className="section-subtitle">Resumen general del sistema de reservaciones</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card stat-card-blue">
                                <div className="stat-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="8.5" cy="7" r="4"></circle>
                                        <polyline points="17 11 19 13 23 9"></polyline>
                                    </svg>
                                </div>
                                <div className="stat-content">
                                    <h3>Reservaciones Activas</h3>
                                    <p className="stat-number">{reservacionesActivas}</p>
                                    <span className="stat-change stat-positive">Confirmadas</span>
                                </div>
                            </div>

                            <div className="stat-card stat-card-green">
                                <div className="stat-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M2 4v16"></path>
                                        <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
                                    </svg>
                                </div>
                                <div className="stat-content">
                                    <h3>Habitaciones Disponibles</h3>
                                    <p className="stat-number">{habitacionesDisponibles} / {habitaciones.length}</p>
                                    <span className="stat-change stat-neutral">Activas</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Reservations */}
                        <div className="dashboard-section-content">
                            <div className="content-header">
                                <h3>Reservaciones Recientes</h3>
                                <button className="btn-primary" onClick={() => abrirModalReservacion('crear')}>
                                    + Nueva Reservación
                                </button>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Habitación</th>
                                            <th>Entrada</th>
                                            <th>Salida</th>
                                            <th>Huéspedes</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservaciones.slice(0, 5).map(res => (
                                            <tr key={res.id}>
                                                <td>#{res.id}</td>
                                                <td>Hab. {res.num_ha}</td>
                                                <td>{res.fecha_entrada}</td>
                                                <td>{res.fecha_salida}</td>
                                                <td>{res.num_huespedes}</td>
                                                <td>${res.total}</td>
                                                <td><span className="badge badge-confirmed">{res.estado_reserva}</span></td>
                                                <td>
                                                    <button className="btn-icon" onClick={() => abrirModalReservacion('editar', res)}>✏️</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Rooms Management */}
                        <div className="dashboard-section-content">
                            <div className="content-header">
                                <h3>Gestión de Habitaciones</h3>
                                <button className="btn-primary" onClick={() => abrirModalHabitacion('crear')}>
                                    + Nueva Habitación
                                </button>
                            </div>
                            <div className="rooms-admin-grid">
                                {habitaciones.slice(0, 6).map(hab => (
                                    <div key={hab.id} className="room-admin-card">
                                        <div className="room-admin-header">
                                            <h4>{hab.tipo}</h4>
                                            <span className={`room-status ${hab.estado === 'Disponible' ? 'room-available' : 'room-occupied'}`}>
                                                {hab.estado}
                                            </span>
                                        </div>
                                        <div className="room-admin-details">
                                            <div className="detail-item">
                                                <span className="detail-label">Precio:</span>
                                                <span className="detail-value">${hab.precio_noche}/noche</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Número:</span>
                                                <span className="detail-value">Hab. {hab.num_ha}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Piso:</span>
                                                <span className="detail-value">Piso {hab.piso}</span>
                                            </div>
                                        </div>
                                        <div className="room-admin-actions">
                                            <button className="btn-edit" onClick={() => abrirModalHabitacion('editar', hab)}>Editar</button>
                                            <button className="btn-delete" onClick={() => eliminarHabitacion(hab.id)}>Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* VISTA HABITACIONES */}
            {vistaActual === 'habitaciones' && (
                <section className="dashboard-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Gestión de Habitaciones</h2>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Buscador
                                    valor={busquedaHabitaciones}
                                    onChange={setBusquedaHabitaciones}
                                    placeholder="Buscar por número, tipo, estado…"
                                />
                                <button className="btn-primary" onClick={() => abrirModalHabitacion('crear')}>
                                    + Nueva Habitación
                                </button>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th>Piso</th>
                                        <th>Tipo</th>
                                        <th>Precio/Noche</th>
                                        <th>Amenidades</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {habitacionesFiltradas.length > 0 ? habitacionesFiltradas.map(hab => (
                                        <tr key={hab.id}>
                                            <td>Hab. {hab.num_ha}</td>
                                            <td>Piso {hab.piso}</td>
                                            <td>{hab.tipo}</td>
                                            <td>${hab.precio_noche}</td>
                                            <td>
                                                {hab.amenidades && hab.amenidades.length > 0
                                                    ? hab.amenidades.join(', ')
                                                    : 'Sin amenidades'}
                                            </td>
                                            <td><span className={`badge ${hab.estado === 'Disponible' ? 'badge-success' : 'badge-warning'}`}>{hab.estado}</span></td>
                                            <td>
                                                <button className="btn-icon" onClick={() => abrirModalHabitacion('editar', hab)}>✏️</button>
                                                <button className="btn-icon btn-danger" onClick={() => eliminarHabitacion(hab.id)}>🗑️</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                                No se encontraron habitaciones
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* VISTA RESERVACIONES */}
            {vistaActual === 'reservaciones' && (
                <section className="dashboard-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Gestión de Reservaciones</h2>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Buscador
                                    valor={busquedaReservaciones}
                                    onChange={setBusquedaReservaciones}
                                    placeholder="Buscar por ID, habitación, estado…"
                                />
                                <button className="btn-primary" onClick={() => abrirModalReservacion('crear')}>
                                    + Nueva Reservación
                                </button>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Usuario</th>
                                        <th>Habitación</th>
                                        <th>Entrada</th>
                                        <th>Salida</th>
                                        <th>Huéspedes</th>
                                        <th>Total</th>
                                        <th>Pendiente</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservacionesFiltradas.length > 0 ? reservacionesFiltradas.map(res => (
                                        <tr key={res.id}>
                                            <td>#{res.id}</td>
                                            <td>{res.id_usuario}</td>
                                            <td>Hab. {res.num_ha}</td>
                                            <td>{res.fecha_entrada}</td>
                                            <td>{res.fecha_salida}</td>
                                            <td>{res.num_huespedes}</td>
                                            <td>${res.total}</td>
                                            <td>${res.pendiente_pago}</td>
                                            <td><span className="badge badge-info">{res.estado_reserva}</span></td>
                                            <td>
                                                <button className="btn-icon" onClick={() => abrirModalReservacion('editar', res)}>✏️</button>
                                                <button className="btn-icon btn-danger" onClick={() => eliminarReservacion(res.id)}>🗑️</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                                No se encontraron reservaciones
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* VISTA USUARIOS */}
            {vistaActual === 'usuarios' && (
                <section className="dashboard-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Gestión de Usuarios</h2>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Buscador
                                    valor={busquedaUsuarios}
                                    onChange={setBusquedaUsuarios}
                                    placeholder="Buscar por nombre, correo, tipo…"
                                />
                                <button className="btn-primary" onClick={() => abrirModalUsuario('crear')}>
                                    + Nuevo Usuario
                                </button>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre Completo</th>
                                        <th>Correo</th>
                                        <th>Teléfono</th>
                                        <th>Tipo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuariosFiltrados.length > 0 ? usuariosFiltrados.map(user => (
                                        <tr key={user.id}>
                                            <td>#{user.id}</td>
                                            <td>{user.nombre} {user.apellidos}</td>
                                            <td>{user.correo}</td>
                                            <td>{user.telefono}</td>
                                            <td><span className="badge badge-primary">{user.tipo}</span></td>
                                            <td>
                                                <button className="btn-icon" onClick={() => abrirModalUsuario('editar', user)}>✏️</button>
                                                <button className="btn-icon btn-danger" onClick={() => eliminarUsuario(user.id)}>🗑️</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                                No se encontraron usuarios
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* VISTA ARTÍCULOS */}
            {vistaActual === 'articulos' && (
                <section className="dashboard-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Gestión de Artículos</h2>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Buscador
                                    valor={busquedaArticulos}
                                    onChange={setBusquedaArticulos}
                                    placeholder="Buscar por nombre, categoría…"
                                />
                                <button className="btn-primary" onClick={() => abrirModalArticulo('crear')}>
                                    + Nuevo Artículo
                                </button>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Precio</th>
                                        <th>Categoría</th>
                                        <th>Disponibilidad</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articulosFiltrados.length > 0 ? articulosFiltrados.map(art => (
                                        <tr key={art.id}>
                                            <td>#{art.id}</td>
                                            <td>{art.nombre}</td>
                                            <td>{art.descripcion}</td>
                                            <td>${art.precio}</td>
                                            <td>{art.categoria}</td>
                                            <td><span className={`badge ${art.disponibilidad === 'Disponible' ? 'badge-success' : 'badge-danger'}`}>{art.disponibilidad}</span></td>
                                            <td>
                                                <button className="btn-icon" onClick={() => abrirModalArticulo('editar', art)}>✏️</button>
                                                <button className="btn-icon btn-danger" onClick={() => eliminarArticulo(art.id)}>🗑️</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                                No se encontraron artículos
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* MODAL UNIVERSAL */}
            {modalAbierto && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {modoModal === 'crear' ? 'Crear' : 'Editar'} {' '}
                                {tipoModal === 'habitacion' && 'Habitación'}
                                {tipoModal === 'reservacion' && 'Reservación'}
                                {tipoModal === 'usuario' && 'Usuario'}
                                {tipoModal === 'articulo' && 'Artículo'}
                            </h2>
                            <button className="modal-close" onClick={cerrarModal}>×</button>
                        </div>

                        <div className="modal-body">
                            {/* FORMULARIO HABITACIÓN */}
                            {tipoModal === 'habitacion' && (
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Número de Habitación</label>
                                        <input
                                            type="number"
                                            value={formHabitacion.num_ha}
                                            onChange={(e) => setFormHabitacion({ ...formHabitacion, num_ha: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Piso</label>
                                        <input
                                            type="number"
                                            value={formHabitacion.piso}
                                            onChange={(e) => setFormHabitacion({ ...formHabitacion, piso: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Tipo</label>
                                        <select
                                            value={formHabitacion.tipo}
                                            onChange={(e) => setFormHabitacion({ ...formHabitacion, tipo: e.target.value })}
                                            className="form-input"
                                        >
                                            <option value="Individual">Individual</option>
                                            <option value="Doble">Doble</option>
                                            <option value="Suite">Suite</option>
                                            <option value="Suite Ejecutiva">Suite Ejecutiva</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Precio por Noche</label>
                                        <input
                                            type="number"
                                            value={formHabitacion.precio_noche}
                                            onChange={(e) => setFormHabitacion({ ...formHabitacion, precio_noche: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group form-group-full">
                                        <label>Amenidades</label>
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                            <input
                                                type="text"
                                                value={nuevaAmenidad}
                                                onChange={(e) => setNuevaAmenidad(e.target.value)}
                                                className="form-input"
                                                placeholder="Ej: WiFi, Minibar..."
                                            />
                                            <button type="button" className="btn-primary" onClick={agregarAmenidad}>+</button>
                                        </div>
                                        <div className="amenidades-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                            {formHabitacion.amenidades && formHabitacion.amenidades.map((amenidad, index) => (
                                                <span key={index} className="badge badge-info" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    {amenidad}
                                                    <button
                                                        type="button"
                                                        onClick={() => eliminarAmenidad(index)}
                                                        style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
                                                    >×</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Estado</label>
                                        <select
                                            value={formHabitacion.estado}
                                            onChange={(e) => setFormHabitacion({ ...formHabitacion, estado: e.target.value })}
                                            className="form-input"
                                        >
                                            <option value="Disponible">Disponible</option>
                                            <option value="Ocupada">Ocupada</option>
                                            <option value="Limpieza">Limpieza</option>
                                            <option value="Mantenimiento">Mantenimiento</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* FORMULARIO RESERVACIÓN */}
                            {tipoModal === 'reservacion' && (
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>ID Usuario</label>
                                        <input
                                            type="text"
                                            value={formReservacion.id_usuario}
                                            onChange={(e) => setFormReservacion({ ...formReservacion, id_usuario: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Número de Habitación</label>
                                        <select
                                            value={formReservacion.num_ha}
                                            onChange={(e) => setFormReservacion({ ...formReservacion, num_ha: e.target.value })}
                                            className="form-input"
                                        >
                                            <option value="">Seleccione habitación</option>
                                            {habitaciones.filter(h => h.estado === 'Disponible').map(hab => (
                                                <option key={hab.id} value={hab.num_ha}>Hab. {hab.num_ha} - {hab.tipo}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Fecha de Entrada</label>
                                        <input
                                            type="date"
                                            value={formReservacion.fecha_entrada}
                                            onChange={(e) => setFormReservacion({ ...formReservacion, fecha_entrada: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Fecha de Salida</label>
                                        <input
                                            type="date"
                                            value={formReservacion.fecha_salida}
                                            onChange={(e) => setFormReservacion({ ...formReservacion, fecha_salida: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Número de Huéspedes</label>
                                        <input
                                            type="number"
                                            value={formReservacion.num_huespedes}
                                            onChange={(e) => setFormReservacion({ ...formReservacion, num_huespedes: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Método de Pago</label>
                                        <select
                                            value={formReservacion.metodo_pago}
                                            onChange={(e) => setFormReservacion({ ...formReservacion, metodo_pago: e.target.value })}
                                            className="form-input"
                                        >
                                            <option value="Tarjeta">Tarjeta</option>
                                            <option value="Efectivo">Efectivo</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Total</label>
                                        <input
                                            type="number"
                                            value={formReservacion.total}
                                            onChange={(e) => setFormReservacion({ ...formReservacion, total: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Pendiente de Pago</label>
                                        <input
                                            type="number"
                                            value={formReservacion.pendiente_pago}
                                            onChange={(e) => setFormReservacion({ ...formReservacion, pendiente_pago: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Estado</label>
                                        <select
                                            value={formReservacion.estado_reserva}
                                            onChange={(e) => setFormReservacion({ ...formReservacion, estado_reserva: e.target.value })}
                                            className="form-input"
                                        >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Confirmada">Confirmada</option>
                                            <option value="Check-in">Check-in</option>
                                            <option value="Completada">Completada</option>
                                            <option value="Cancelada">Cancelada</option>
                                        </select>
                                    </div>
                                    <div className="form-group form-group-full">
                                        <label>Notas</label>
                                        <textarea
                                            value={formReservacion.notas}
                                            onChange={(e) => setFormReservacion({ ...formReservacion, notas: e.target.value })}
                                            className="form-input"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                            )}

                            {/* FORMULARIO USUARIO */}
                            {tipoModal === 'usuario' && (
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            value={formUsuario.nombre}
                                            onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Apellidos</label>
                                        <input
                                            type="text"
                                            value={formUsuario.apellidos}
                                            onChange={(e) => setFormUsuario({ ...formUsuario, apellidos: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Correo</label>
                                        <input
                                            type="email"
                                            value={formUsuario.correo}
                                            onChange={(e) => setFormUsuario({ ...formUsuario, correo: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Teléfono</label>
                                        <input
                                            type="tel"
                                            value={formUsuario.telefono}
                                            onChange={(e) => setFormUsuario({ ...formUsuario, telefono: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Contraseña</label>
                                        <input
                                            type="password"
                                            value={formUsuario.password}
                                            onChange={(e) => setFormUsuario({ ...formUsuario, password: e.target.value })}
                                            className="form-input"
                                            placeholder={modoModal === 'editar' ? 'Dejar en blanco para no cambiar' : ''}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Tipo de Usuario</label>
                                        <select
                                            value={formUsuario.tipo}
                                            onChange={(e) => setFormUsuario({ ...formUsuario, tipo: e.target.value })}
                                            className="form-input"
                                        >
                                            <option value="usuario">Usuario</option>
                                            <option value="admin">Administrador</option>
                                            <option value="empleado">Empleado</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* FORMULARIO ARTÍCULO */}
                            {tipoModal === 'articulo' && (
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            value={formArticulo.nombre}
                                            onChange={(e) => setFormArticulo({ ...formArticulo, nombre: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Precio</label>
                                        <input
                                            type="number"
                                            value={formArticulo.precio}
                                            onChange={(e) => setFormArticulo({ ...formArticulo, precio: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Categoría</label>
                                        <select
                                            value={formArticulo.categoria}
                                            onChange={(e) => setFormArticulo({ ...formArticulo, categoria: e.target.value })}
                                            className="form-input"
                                        >
                                            <option value="Restaurante">Restaurante</option>
                                            <option value="Blancos">Blancos</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Disponibilidad</label>
                                        <select
                                            value={formArticulo.disponibilidad}
                                            onChange={(e) => setFormArticulo({ ...formArticulo, disponibilidad: e.target.value })}
                                            className="form-input"
                                        >
                                            <option value="Disponible">Disponible</option>
                                            <option value="Agotado">Agotado</option>
                                        </select>
                                    </div>
                                    <div className="form-group form-group-full">
                                        <label>Descripción</label>
                                        <textarea
                                            value={formArticulo.descripcion}
                                            onChange={(e) => setFormArticulo({ ...formArticulo, descripcion: e.target.value })}
                                            className="form-input"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={cerrarModal}>Cancelar</button>
                            <button
                                className="btn-primary"
                                onClick={() => {
                                    if (tipoModal === 'habitacion') guardarHabitacion();
                                    else if (tipoModal === 'reservacion') guardarReservacion();
                                    else if (tipoModal === 'usuario') guardarUsuario();
                                    else if (tipoModal === 'articulo') guardarArticulo();
                                }}
                            >
                                {modoModal === 'crear' ? 'Crear' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                            <p>Email: admin@hotelflow.com</p>
                            <p>Tel: +1 (555) 123-4567</p>
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

export default AdminDashboard;