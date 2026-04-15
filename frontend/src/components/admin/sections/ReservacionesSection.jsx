import React, { useState } from "react";
import { cambiarEstadoReservacion } from "../../../api/reservacionesService";

// Colores por estado
const ESTADO_STYLES = {
    "Confirmada": { bg: "#dcfce7", color: "#16a34a", label: "Confirmada" },
    "Check-in":   { bg: "#dbeafe", color: "#1d4ed8", label: "Check-in" },
    "Check-out":  { bg: "#f3f4f6", color: "#6b7280", label: "Check-out" },
    "Cancelada":  { bg: "#fee2e2", color: "#dc2626", label: "Cancelada" },
    "Cobrada":    { bg: "#fef9c3", color: "#b45309", label: "Cobrada" },
};

// Modal de cobro
const ModalCobro = ({ reserva, onClose, onConfirm }) => {
    const [metodoPago, setMetodoPago] = useState("Efectivo");
    const [cargando, setCargando] = useState(false);

    const handleCobrar = async () => {
        setCargando(true);
        await onConfirm(reserva.id, metodoPago);
        setCargando(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
                <div className="modal-header">
                    <h2>💳 Registrar Cobro</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <div style={{ background: "#f8fafc", borderRadius: 8, padding: "16px", marginBottom: 20 }}>
                        <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>Habitación <strong style={{ color: "#1e293b" }}>{reserva.num_hab}</strong></p>
                        <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.9rem" }}>
                            {reserva.fecha_entrada} → {reserva.fecha_salida} · {reserva.num_huespedes} huésped(es)
                        </p>
                        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Total a cobrar:</span>
                            <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e3a8a" }}>
                                ${Number(reserva.total || 0).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ fontWeight: 600, fontSize: "0.875rem", color: "#1f2937", display: "block", marginBottom: 6 }}>
                            Método de pago
                        </label>
                        <select
                            className="form-input"
                            value={metodoPago}
                            onChange={e => setMetodoPago(e.target.value)}
                        >
                            <option>Efectivo</option>
                            <option>Tarjeta de crédito</option>
                            <option>Tarjeta de débito</option>
                            <option>Transferencia</option>
                        </select>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Cancelar</button>
                    <button
                        onClick={handleCobrar}
                        disabled={cargando}
                        style={{
                            padding: "0.75rem 1.5rem",
                            background: "linear-gradient(135deg, #d97706, #b45309)",
                            color: "white", border: "none", borderRadius: 6,
                            fontWeight: 700, cursor: "pointer", fontSize: "0.9375rem"
                        }}
                    >
                        {cargando ? "Procesando..." : "✅ Confirmar cobro"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReservacionesSection = ({ reservaciones, abrirModal, eliminarReservacion, onRecargar }) => {
    const [cobrando, setCobrando] = useState(null); // reserva seleccionada para cobrar
    const [procesando, setProcesando] = useState(null); // id procesando acción

    const handleAccion = async (id, nuevoEstado) => {
        if (!window.confirm(`¿Confirmar cambio a "${nuevoEstado}"?`)) return;
        setProcesando(id);
        try {
            await cambiarEstadoReservacion(id, nuevoEstado);
            onRecargar?.();
        } catch (e) {
            alert("Error al cambiar el estado: " + (e?.response?.data?.mensaje || e.message));
        } finally {
            setProcesando(null);
        }
    };

    const handleCobrarConfirm = async (id, metodoPago) => {
        try {
            // Cambiar estado a "Cobrada" (usamos Check-out como estado final de cobro también)
            await cambiarEstadoReservacion(id, "Check-out");
            onRecargar?.();
            setCobrando(null);
            alert(`✅ Cobro registrado con ${metodoPago}`);
        } catch (e) {
            alert("Error al registrar cobro.");
        }
    };

    // Ordenar: más recientes primero
    const ordenadas = [...reservaciones].sort((a, b) =>
        (b.creado_en || "").localeCompare(a.creado_en || "")
    );

    return (
        <div className="section-content">
            <div className="content-header">
                <h2>Gestión de Reservaciones</h2>
                <button className="btn-primary" onClick={() => abrirModal("crear")}>
                    + Nueva Reservación
                </button>
            </div>

            {ordenadas.length === 0 ? (
                <p style={{ marginTop: "20px", color: "#64748b" }}>No hay reservaciones registradas.</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Hab.</th>
                                <th>Huésped / ID</th>
                                <th>Entrada</th>
                                <th>Salida</th>
                                <th>Huésp.</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th style={{ minWidth: 260 }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenadas.map((res) => {
                                const estilo = ESTADO_STYLES[res.estado_reserva] || ESTADO_STYLES["Confirmada"];
                                const ocupado = procesando === res.id;

                                return (
                                    <tr key={res.id}>
                                        <td><strong>Hab. {res.num_hab}</strong></td>
                                        <td style={{ fontSize: "0.82rem", color: "#64748b", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {res.id_usuario}
                                        </td>
                                        <td>{res.fecha_entrada}</td>
                                        <td>{res.fecha_salida}</td>
                                        <td style={{ textAlign: "center" }}>{res.num_huespedes}</td>
                                        <td><strong>${Number(res.total || 0).toFixed(2)}</strong></td>
                                        <td>
                                            <span style={{
                                                padding: "4px 10px", borderRadius: 20,
                                                fontSize: "0.78rem", fontWeight: 700,
                                                background: estilo.bg, color: estilo.color,
                                            }}>
                                                {estilo.label}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>

                                                {/* ── Check-in (desde Confirmada) */}
                                                {res.estado_reserva === "Confirmada" && (
                                                    <button
                                                        disabled={ocupado}
                                                        onClick={() => handleAccion(res.id, "Check-in")}
                                                        style={btnStyle("#1d4ed8")}
                                                        title="Registrar llegada del huésped"
                                                    >
                                                        🏨 Check-in
                                                    </button>
                                                )}

                                                {/* ── Cobrar y Check-out (desde Check-in) */}
                                                {res.estado_reserva === "Check-in" && (
                                                    <>
                                                        <button
                                                            disabled={ocupado}
                                                            onClick={() => setCobrando(res)}
                                                            style={btnStyle("#d97706")}
                                                            title="Cobrar y hacer checkout"
                                                        >
                                                            💳 Cobrar
                                                        </button>
                                                        <button
                                                            disabled={ocupado}
                                                            onClick={() => handleAccion(res.id, "Check-out")}
                                                            style={btnStyle("#6b7280")}
                                                            title="Solo checkout sin cobro"
                                                        >
                                                            🚪 Check-out
                                                        </button>
                                                    </>
                                                )}

                                                {/* ── Cancelar (desde Confirmada) */}
                                                {res.estado_reserva === "Confirmada" && (
                                                    <button
                                                        disabled={ocupado}
                                                        onClick={() => handleAccion(res.id, "Cancelada")}
                                                        style={btnStyle("#dc2626")}
                                                        title="Cancelar reservación"
                                                    >
                                                        ✕
                                                    </button>
                                                )}

                                                {/* ── Editar → siempre */}
                                                <button
                                                    className="btn-icon"
                                                    onClick={() => abrirModal("editar", res)}
                                                    title="Editar reservación"
                                                >
                                                    ✏️
                                                </button>

                                                {/* ── Eliminar */}
                                                <button
                                                    className="btn-icon btn-delete"
                                                    onClick={() => eliminarReservacion(res.id)}
                                                    title="Eliminar reservación"
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de cobro */}
            {cobrando && (
                <ModalCobro
                    reserva={cobrando}
                    onClose={() => setCobrando(null)}
                    onConfirm={handleCobrarConfirm}
                />
            )}
        </div>
    );
};

// Estilo inline reutilizable para botones de acción
const btnStyle = (color) => ({
    padding: "5px 10px",
    background: color,
    color: "white",
    border: "none",
    borderRadius: 6,
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
    opacity: 1,
    transition: "opacity 0.2s",
    whiteSpace: "nowrap",
});

export default ReservacionesSection;