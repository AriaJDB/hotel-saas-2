import React from "react";

const HabitacionForm = ({
    formHabitacion,
    setFormHabitacion,
    nuevaAmenidad,
    setNuevaAmenidad,
    agregarAmenidad,
    eliminarAmenidad
}) => {
    return (
        <div className="form-grid">
            <div className="form-group">
                <label>Número de Habitación</label>
                <input
                    type="number"
                    value={formHabitacion.num}//aqui cambie num_ha
                    onChange={(e) =>
                        setFormHabitacion({ ...formHabitacion, num: e.target.value })//aqui tambien
                    }
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Piso</label>
                <input
                    type="number"
                    value={formHabitacion.piso}
                    onChange={(e) =>
                        setFormHabitacion({ ...formHabitacion, piso: e.target.value })
                    }
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Tipo</label>
                <select
                    value={formHabitacion.tipo}
                    onChange={(e) =>
                        setFormHabitacion({ ...formHabitacion, tipo: e.target.value })
                    }
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
                    onChange={(e) =>
                        setFormHabitacion({ ...formHabitacion, precio_noche: e.target.value })
                    }
                    className="form-input"
                />
            </div>

            <div className="form-group form-group-full">
                <label>Amenidades</label>

                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                    <input
                        type="text"
                        value={nuevaAmenidad}
                        onChange={(e) => setNuevaAmenidad(e.target.value)}
                        className="form-input"
                        placeholder="Ej: WiFi, Minibar..."
                    />
                    <button type="button" className="btn-primary" onClick={agregarAmenidad}>
                        +
                    </button>
                </div>

                <div className="amenidades-list" style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {formHabitacion.amenidades?.map((amenidad, index) => (
                        <span key={index} className="badge badge-info">
                            {amenidad}
                            <button
                                type="button"
                                onClick={() => eliminarAmenidad(index)}
                                style={{ marginLeft: "5px", color: "red", border: "none", background: "none" }}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>Estado</label>
                <select
                    value={formHabitacion.estado}
                    onChange={(e) =>
                        setFormHabitacion({ ...formHabitacion, estado: e.target.value })
                    }
                    className="form-input"
                >
                    <option value="Disponible">Disponible</option>
                    <option value="Ocupada">Ocupada</option>
                    <option value="Limpieza">Limpieza</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                </select>
            </div>
        </div>
    );
};

export default HabitacionForm;