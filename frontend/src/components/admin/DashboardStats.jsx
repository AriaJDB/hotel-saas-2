const DashboardStats = ({ habitaciones, reservaciones }) => {

  const reservacionesActivas =
    reservaciones.filter(r => r.estado_reserva === "Confirmada").length;

  const habitacionesDisponibles =
    habitaciones.filter(h => h.estado === "Disponible").length;

  return (
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
          <p className="stat-number">
            {habitacionesDisponibles} / {habitaciones.length}
          </p>
          <span className="stat-change stat-neutral">Activas</span>
        </div>
      </div>

    </div>
  );
};

export default DashboardStats;