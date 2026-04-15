import React, { useState, useEffect } from "react";

/**
 * Modal para editar una reservación existente del cliente
 * Solo permite modificar fechas, número de huéspedes y notas (no el estado)
 */
const EditarReservaModal = ({ reserva, onClose, onGuardar }) => {
    const hoy = new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        fecha_entrada: reserva.fecha_entrada || hoy,
        fecha_salida: reserva.fecha_salida || hoy,
        num_huespedes: reserva.num_huespedes || 1,
        notas: reserva.notas || "",
    });
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const dias = Math.max(1, Math.ceil(
        (new Date(form.fecha_salida) - new Date(form.fecha_entrada)) / (1000 * 60 * 60 * 24)
    ));

    const precioNoche = reserva.total / Math.max(1, Math.ceil(
        (new Date(reserva.fecha_salida) - new Date(reserva.fecha_entrada)) / (1000 * 60 * 60 * 24)
    ));
    const nuevoTotal = dias * precioNoche;

    const handleGuardar = async () => {
        if (form.fecha_salida <= form.fecha_entrada) {
            setError("La fecha de salida debe ser posterior a la de entrada.");
            return;
        }
        setCargando(true);
        setError(null);
        try {
            await onGuardar(reserva.id, {
                ...form,
                total: nuevoTotal,
            });
            onClose();
        } catch (e) {
            setError("Error al guardar los cambios. Intenta de nuevo.");
        } finally {
            setCargando(false);
        }
    };

    // Escape para cerrar
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>

                <div className="modal-header">
                    <h2>✏️ Editar Reservación — Hab. {reserva.num_hab}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {error && (
                        <div style={{
                            background: "#fee2e2", color: "#dc2626",
                            padding: "10px 14px", borderRadius: 8, marginBottom: 16,
                            fontSize: "0.9rem"
                        }}>{error}</div>
                    )}

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Fecha de Entrada</label>
                            <input
                                type="date"
                                className="form-input"
                                min={hoy}
                                value={form.fecha_entrada}
                                onChange={e => setForm({ ...form, fecha_entrada: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Fecha de Salida</label>
                            <input
                                type="date"
                                className="form-input"
                                min={form.fecha_entrada}
                                value={form.fecha_salida}
                                onChange={e => setForm({ ...form, fecha_salida: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Número de Huéspedes</label>
                            <input
                                type="number"
                                className="form-input"
                                min={1} max={10}
                                value={form.num_huespedes}
                                onChange={e => setForm({ ...form, num_huespedes: Number(e.target.value) })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Duración</label>
                            <div style={{
                                padding: "10px 14px", background: "#e0f2fe",
                                borderRadius: 8, color: "#0369a1", fontWeight: 600
                            }}>
                                {dias} {dias === 1 ? "noche" : "noches"}
                            </div>
                        </div>

                        <div className="form-group form-group-full">
                            <label>Notas adicionales</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Pedidos especiales, llegada tardía..."
                                value={form.notas}
                                onChange={e => setForm({ ...form, notas: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Total actualizado */}
                    <div style={{
                        background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
                        borderRadius: 8, padding: "14px 20px", marginTop: 8,
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", color: "white"
                    }}>
                        <span style={{ fontWeight: 600 }}>Nuevo total estimado:</span>
                        <span style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                            ${nuevoTotal.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose} disabled={cargando}>
                        Cancelar
                    </button>
                    <button className="btn-primary" onClick={handleGuardar} disabled={cargando}>
                        {cargando ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditarReservaModal;
