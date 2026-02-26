import React from 'react';

export default function HabitacionesAdminSection({
    habitaciones,
    abrirModalHabitacion,
    eliminarHabitacion
}) {
    return (
        <div className="dashboard-section-content">
            <div className="content-header">
                <h3>Gestión de Habitaciones</h3>
                <button
                    className="btn-primary"
                    onClick={() => abrirModalHabitacion('crear')}
                >
                    + Nueva Habitación
                </button>
            </div>

            <div className="rooms-admin-grid">
                {habitaciones.slice(0, 6).map(hab => (
                    <div key={hab.id} className="room-admin-card">
                        <div className="room-admin-header">
                            <h4>{hab.tipo}</h4>
                            <span
                                className={`room-status ${
                                    hab.estado === 'Disponible'
                                        ? 'room-available'
                                        : 'room-occupied'
                                }`}
                            >
                                {hab.estado}
                            </span>
                        </div>

                        <div className="room-admin-details">
                            <div className="detail-item">
                                <span className="detail-label">Precio:</span>
                                <span className="detail-value">
                                    ${hab.precio_noche}/noche
                                </span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Número:</span>
                                <span className="detail-value">
                                    Hab. {hab.num}
                                </span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Piso:</span>
                                <span className="detail-value">
                                    Piso {hab.piso}
                                </span>
                            </div>
                        </div>

                        <div className="room-admin-actions">
                            <button
                                className="btn-edit"
                                onClick={() =>
                                    abrirModalHabitacion('editar', hab)
                                }
                            >
                                Editar
                            </button>

                            <button
                                className="btn-delete"
                                onClick={() =>
                                    eliminarHabitacion(hab.id)
                                }
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}