import React from "react";

const ReservacionesSection = ({
  reservaciones,
  abrirModal,
  eliminarReservacion
}) => {
  return (
    <div className="section-content">

      <div className="content-header">
        <h2>Gestión de Reservaciones</h2>
        <button
          className="btn-primary"
          onClick={() => abrirModal("crear")}
        >
          + Nueva Reservación
        </button>
      </div>

      {reservaciones.length === 0 ? (
        <p style={{ marginTop: "20px", color: "#64748b" }}>
          No hay reservaciones registradas.
        </p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Habitación</th>
                <th>Usuario</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Huéspedes</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservaciones.map((res) => (
                <tr key={res.id}>
                  <td>#{res.id}</td>
                  <td>Hab. {res.num_ha}</td>
                  <td>{res.id_usuario}</td>
                  <td>{res.fecha_entrada}</td>
                  <td>{res.fecha_salida}</td>
                  <td>{res.num_huespedes}</td>
                  <td>${res.total}</td>
                  <td>
                    <span className={`badge ${
                      res.estado_reserva === "Confirmada"
                        ? "badge-success"
                        : res.estado_reserva === "Pendiente"
                        ? "badge-warning"
                        : "badge-danger"
                    }`}>
                      {res.estado_reserva}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-icon"
                      onClick={() => abrirModal("editar", res)}
                    >
                      ✏️
                    </button>

                    <button
                      className="btn-icon btn-delete"
                      onClick={() => eliminarReservacion(res.id)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default ReservacionesSection;