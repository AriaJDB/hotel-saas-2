import React from "react";
import HabitacionForm from "./forms/HabitacionForm";
import ReservacionForm from "./forms/ReservacionForm";
import UsuarioForm from "./forms/UsuarioForm";
import ArticuloForm from "./forms/ArticuloForm";

const ModalUniversal = ({
    modalAbierto,
    cerrarModal,
    tipoModal,
    modoModal,
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
    agregarAmenidad,
    eliminarAmenidad,
    habitaciones,
    guardarHabitacion,
    guardarReservacion,
    guardarUsuario,
    guardarArticulo
}) => {

    if (!modalAbierto) return null;

    return (
        <div className="modal-overlay" onClick={cerrarModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        {modoModal === 'crear' ? 'Crear' : 'Editar'}{' '}
                        {tipoModal === 'habitacion' && 'Habitación'}
                        {tipoModal === 'reservacion' && 'Reservación'}
                        {tipoModal === 'usuario' && 'Usuario'}
                        {tipoModal === 'articulo' && 'Artículo'}
                    </h2>
                    <button className="modal-close" onClick={cerrarModal}>×</button>
                </div>

                <div className="modal-body">
                    {tipoModal === "habitacion" && (
                        <HabitacionForm
                            formHabitacion={formHabitacion}
                            setFormHabitacion={setFormHabitacion}
                            nuevaAmenidad={nuevaAmenidad}
                            setNuevaAmenidad={setNuevaAmenidad}
                            agregarAmenidad={agregarAmenidad}
                            eliminarAmenidad={eliminarAmenidad}
                        />
                    )}

                    {tipoModal === "reservacion" && (
                        <ReservacionForm
                            formReservacion={formReservacion}
                            setFormReservacion={setFormReservacion}
                            habitaciones={habitaciones}
                        />
                    )}

                    {tipoModal === "usuario" && (
                        <UsuarioForm
                            formUsuario={formUsuario}
                            setFormUsuario={setFormUsuario}
                            modoModal={modoModal}
                        />
                    )}

                    {tipoModal === "articulo" && (
                        <ArticuloForm
                            formArticulo={formArticulo}
                            setFormArticulo={setFormArticulo}
                        />
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={cerrarModal}>
                        Cancelar
                    </button>

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
    );
};
export default ModalUniversal;