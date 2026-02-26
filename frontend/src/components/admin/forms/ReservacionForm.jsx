import React from "react";

const ReservacionForm = ({
    formReservacion,
    setFormReservacion,
    habitaciones
}) => {
    return (
        <div className="form-grid">

            <div className="form-group">
                <label>ID Usuario</label>
                <input
                    type="text"
                    value={formReservacion.id_usuario}
                    onChange={(e) =>
                        setFormReservacion({
                            ...formReservacion,
                            id_usuario: e.target.value
                        })
                    }
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Número de Habitación</label>
                <select
                    value={formReservacion.num_ha}
                    onChange={(e) =>
                        setFormReservacion({
                            ...formReservacion,
                            num_ha: e.target.value
                        })
                    }
                    className="form-input"
                >
                    <option value="">Seleccione habitación</option>
                    {habitaciones
                        ?.filter((h) => h.estado === "Disponible")
                        .map((hab) => (
                            <option key={hab.id} value={hab.num}>
                                Hab. {hab.num} - {hab.tipo}
                            </option>
                        ))}
                </select>
            </div>

            <div className="form-group">
                <label>Fecha de Entrada</label>
                <input
                    type="date"
                    value={formReservacion.fecha_entrada}
                    onChange={(e) =>
                        setFormReservacion({
                            ...formReservacion,
                            fecha_entrada: e.target.value
                        })
                    }
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Fecha de Salida</label>
                <input
                    type="date"
                    value={formReservacion.fecha_salida}
                    onChange={(e) =>
                        setFormReservacion({
                            ...formReservacion,
                            fecha_salida: e.target.value
                        })
                    }
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Número de Huéspedes</label>
                <input
                    type="number"
                    value={formReservacion.num_huespedes}
                    onChange={(e) =>
                        setFormReservacion({
                            ...formReservacion,
                            num_huespedes: e.target.value
                        })
                    }
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Método de Pago</label>
                <select
                    value={formReservacion.metodo_pago}
                    onChange={(e) =>
                        setFormReservacion({
                            ...formReservacion,
                            metodo_pago: e.target.value
                        })
                    }
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
                    onChange={(e) =>
                        setFormReservacion({
                            ...formReservacion,
                            total: e.target.value
                        })
                    }
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Pendiente de Pago</label>
                <input
                    type="number"
                    value={formReservacion.pendiente_pago}
                    onChange={(e) =>
                        setFormReservacion({
                            ...formReservacion,
                            pendiente_pago: e.target.value
                        })
                    }
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Estado</label>
                <select
                    value={formReservacion.estado_reserva}
                    onChange={(e) =>
                        setFormReservacion({
                            ...formReservacion,
                            estado_reserva: e.target.value
                        })
                    }
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
                    onChange={(e) =>
                        setFormReservacion({
                            ...formReservacion,
                            notas: e.target.value
                        })
                    }
                    className="form-input"
                    rows="3"
                />
            </div>

        </div>
    );
};

export default ReservacionForm;