const HabitacionesSection = ({
    habitaciones,
    abrirModal,
    eliminarHabitacion
}) => {
    return (

        <div className="section-card">
            <div className="section-header">
                <h2>Habitaciones</h2>
                <button
                    className="btn-primary"
                    onClick={() => abrirModal("habitacion", "crear")}
                >
                    Nueva Habitación
                </button>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Tipo</th>
                        <th>Piso</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {habitaciones.map((hab) => (
                        <tr key={hab.id}>
                            <td>{hab.num}</td>
                            <td>{hab.tipo}</td>
                            <td>{hab.piso}</td>
                            <td>${hab.precio_noche}</td>
                            <td>{hab.estado}</td>
                            <td>
                                <button
                                    className="btn-icon"
                                    onClick={() =>
                                        abrirModal("habitacion", "editar", hab)
                                    }
                                >
                                    ✏️
                                </button>

                                <button
                                    className="btn-icon btn-danger"
                                    onClick={() =>
                                        eliminarHabitacion(hab.id)
                                    }
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
};

export default HabitacionesSection;