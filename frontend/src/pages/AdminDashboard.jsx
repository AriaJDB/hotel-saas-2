import React, { useEffect, useState } from 'react';
import ModalUniversal from "../components/admin/ModalUniversal";
import Footer from "../components/layout/Footer";
import HabitacionesSection from "../components/admin/sections/HabitacionesSection";
import UsuariosSection from "../components/admin/sections/UsuariosSection";
import ArticulosSection from '../components/admin/sections/ArticulosSection';
import HabitacionesAdminSection from '../components/admin/sections/HabitacionesAdminSection';
import ReservacionesSection from '../components/admin/sections/ReservacionesSection';
import { useAdminData } from '../hooks/useAdminData';
import '../styles/AdminStyles.css';
import AdminHeader from '../components/admin/adminHeader';
import DashboardStats from "../components/admin/DashboardStats";
import { useAdminForms } from "../hooks/useAdminForms";

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

    const {
        habitaciones,
        reservaciones,
        usuarios,
        articulos,
        cargarDatos,
        crearHabitacion,
        actualizarHabitacion,
        eliminarHabitacion,
        crearReservacion,
        actualizarReservacion,
        eliminarReservacion,
        crearUsuario,
        actualizarUsuario,
        eliminarUsuario,
        crearArticulo,
        actualizarArticulo,
        eliminarArticulo
    } = useAdminData();

    const [usuario, setUsuario] = useState(null);

    // Estados para modales

    // ========== BUSCADORES ==========
    const [busquedaHabitaciones, setBusquedaHabitaciones] = useState('');
    const [busquedaReservaciones, setBusquedaReservaciones] = useState('');
    const [busquedaUsuarios, setBusquedaUsuarios] = useState('');
    const [busquedaArticulos, setBusquedaArticulos] = useState('');



    // Estados para formularios


    const [vistaActual, setVistaActual] = useState('dashboard');

    const cerrarSesion = () => {
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    };

    // LLAMADAS A LA API


    const guardarHabitacion = async () => {
        try {
            if (modoModal === 'crear') {
                await crearHabitacion(formHabitacion);
            } else {
                await actualizarHabitacion(itemSeleccionado.id, formHabitacion);
            }
            cargarDatos();
            cerrarModal();
            alert('Habitación guardada con éxito');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la solicitud');
        }
    };

    const guardarReservacion = async () => {
        try {
            if (modoModal === 'crear') {
                await crearReservacion(formReservacion);
            } else {
                await actualizarReservacion(itemSeleccionado.id, formReservacion);
            }
            cargarDatos();
            cerrarModal();
            alert('Reservación guardada exitosamente');
        } catch (error) {
            console.error('Error guardando reservación:', error);
            alert('Error al guardar reservación');
        }
    };

    const eliminarHabitacionHandler = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta habitación?')) {
            try {
                await eliminarHabitacion(id); // esta es la del service
                await cargarDatos();
                alert('Habitación eliminada exitosamente');
            } catch (error) {
                console.error('Error eliminando habitación:', error);
                alert('Error al eliminar habitación');
            }
        }
    };



    const guardarUsuario = async () => {
        try {
            if (modoModal === 'crear') {
                console.log('[DEBUG] Creando usuario:', formUsuario);
                const resultado = await crearUsuario(formUsuario);
                console.log('[DEBUG] Resultado crear:', resultado);
            } else {
                console.log('[DEBUG] Editando usuario ID:', itemSeleccionado?.id, 'Datos:', formUsuario);
                const resultado = await actualizarUsuario(itemSeleccionado.id, formUsuario);
                console.log('[DEBUG] Resultado editar:', resultado);
                if (resultado && resultado.exito === false) {
                    throw new Error(resultado.mensaje || 'Error al actualizar');
                }
            }
            cargarDatos();
            cerrarModal();
            alert('Usuario guardado exitosamente');
        } catch (error) {
            console.error('Error guardando usuario:', error);
            alert('Error al guardar usuario: ' + (error.response?.data?.mensaje || error.message || 'desconocido'));
        }
    };




    const guardarArticulo = async () => {
        try {
            if (modoModal === 'crear') {
                await crearArticulo(formArticulo);
            } else {
                await actualizarArticulo(itemSeleccionado.id, formArticulo);
            }
            cargarDatos();
            cerrarModal();
            alert('Artículo guardado exitosamente');
        } catch (error) {
            console.error('Error guardando artículo:', error);
            alert('Error al guardar artículo');
        }
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


    // ========== FUNCIONES CRUD ARTÍCULOS ==========

    // ========== CALCULOS ESTADISTICAS ==========
    const {
        modalAbierto,
        tipoModal,
        modoModal,
        itemSeleccionado,
        formHabitacion,
        setFormHabitacion,
        formReservacion,
        setFormReservacion,
        formUsuario,
        setFormUsuario,
        formArticulo,
        setFormArticulo,
        nuevaAmenidad,
        setNuevaAmenidad,
        abrirModal,
        cerrarModal,
        agregarAmenidad,
        eliminarAmenidad
    } = useAdminForms();

    return (
        <div>
            {/* Header */}
            <AdminHeader
                usuario={usuario}
                vistaActual={vistaActual}
                setVistaActual={setVistaActual}
                cerrarSesion={cerrarSesion}
            />

            {/* VISTA DASHBOARD */}
            {vistaActual === 'dashboard' && (
                <section id="dashboard" className="dashboard-section">
                    <div className="container">
                        <div className="section-header">

                            <h2 className="section-title">Panel de Control</h2>
                            <p className="section-subtitle">Resumen general del sistema de reservaciones</p>
                        </div>
                        <DashboardStats
                            habitaciones={habitaciones}
                            reservaciones={reservaciones}
                        />

                        {/* Recent Reservations */}
                        <div className="dashboard-section-content">
                            <div className="content-header">
                                <h3>Reservaciones Recientes</h3>
                                <button
                                    className="btn-primary"
                                    onClick={() => abrirModal('reservacion', 'crear')}
                                >
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
                                                    <button
                                                        className="btn-icon"
                                                        onClick={() => abrirModal('reservacion', 'editar', res)}
                                                    >
                                                        ✏️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Rooms Management */}
                        {vistaActual === 'dashboard' && (
                            <HabitacionesAdminSection
                                habitaciones={habitaciones}
                                abrirModalHabitacion={(modo, item) =>
                                    abrirModal('habitacion', modo, item)
                                }
                                eliminarHabitacion={eliminarHabitacionHandler}
                            />
                        )}
                    </div>
                </section>
            )}

            {/* VISTA HABITACIONES */}

            <section className="dashboard-section">
                <div className="container">
                    {vistaActual === 'habitaciones' && (
                        <>
                            <div style={{ padding: '1rem 0' }}>
                                <Buscador valor={busquedaHabitaciones} onChange={setBusquedaHabitaciones} placeholder="Buscar por número, tipo, estado..." />
                            </div>
                            <HabitacionesSection habitaciones={habitacionesFiltradas} abrirModal={(modo, item) => abrirModal('habitacion', modo, item)} eliminarHabitacion={eliminarHabitacionHandler} />
                        </>
                    )}

                    {vistaActual === 'reservaciones' && (
                        <>
                            <div style={{ padding: '1rem 0' }}>
                                <Buscador valor={busquedaReservaciones} onChange={setBusquedaReservaciones} placeholder="Buscar por habitación, usuario, estado..." />
                            </div>
                            <ReservacionesSection reservaciones={reservacionesFiltradas} abrirModal={(modo, item) => abrirModal('reservacion', modo, item)} eliminarReservacion={eliminarReservacion} />
                        </>
                    )}

                    {vistaActual === 'usuarios' && (
                        <>
                            <div style={{ padding: '1rem 0' }}>
                                <Buscador valor={busquedaUsuarios} onChange={setBusquedaUsuarios} placeholder="Buscar usuario por nombre, correo, tipo..." />
                            </div>
                            <UsuariosSection usuarios={usuariosFiltrados} abrirModal={(modo, item) => abrirModal('usuario', modo, item)} eliminarUsuario={eliminarUsuario} />
                        </>
                    )}

                    {vistaActual === 'articulos' && (
                        <>
                            <div style={{ padding: '1rem 0' }}>
                                <Buscador valor={busquedaArticulos} onChange={setBusquedaArticulos} placeholder="Buscar artículo por nombre, categoría..." />
                            </div>
                            <ArticulosSection articulos={articulosFiltrados} abrirModal={(modo, item) => abrirModal('articulo', modo, item)} eliminarArticulo={eliminarArticulo} />
                        </>
                    )}

                </div>
            </section>



            {/* MODAL UNIVERSAL */}
            <ModalUniversal
                modalAbierto={modalAbierto}
                cerrarModal={cerrarModal}
                tipoModal={tipoModal}
                modoModal={modoModal}
                formHabitacion={formHabitacion}
                setFormHabitacion={setFormHabitacion}
                formReservacion={formReservacion}
                setFormReservacion={setFormReservacion}
                formUsuario={formUsuario}
                setFormUsuario={setFormUsuario}
                formArticulo={formArticulo}
                setFormArticulo={setFormArticulo}
                nuevaAmenidad={nuevaAmenidad}
                setNuevaAmenidad={setNuevaAmenidad}
                agregarAmenidad={agregarAmenidad}
                eliminarAmenidad={eliminarAmenidad}
                habitaciones={habitaciones}
                guardarHabitacion={guardarHabitacion}
                guardarReservacion={guardarReservacion}
                guardarUsuario={guardarUsuario}
                guardarArticulo={guardarArticulo}
            />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AdminDashboard;