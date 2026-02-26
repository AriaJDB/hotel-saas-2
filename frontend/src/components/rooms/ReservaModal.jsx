import React, { useState, useEffect } from "react";

const ReservaModal = ({ hab, usuario, onClose, onConfirmar }) => {
    const hoy = new Date().toISOString().split('T')[0];
    const manana = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const [form, setForm] = useState({
        fecha_entrada: hoy,
        fecha_salida: manana,
        num_huespedes: 1,
        notas: ""
    });
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const dias = Math.max(1, Math.ceil(
        (new Date(form.fecha_salida) - new Date(form.fecha_entrada)) / (1000 * 60 * 60 * 24)
    ));
    const total = dias * (hab?.precio_noche || 0);

    const handleSubmit = async () => {
        if (form.fecha_salida <= form.fecha_entrada) {
            setError("La fecha de salida debe ser posterior a la de entrada.");
            return;
        }
        setCargando(true);
        setError(null);
        try {
            await onConfirmar({
                id_usuario: usuario.id,
                num_hab: hab.num || hab.num_ha,
                fecha_entrada: form.fecha_entrada,
                fecha_salida: form.fecha_salida,
                num_huespedes: form.num_huespedes,
                notas: form.notas,
                precio_noche: hab.precio_noche,
                total
            });
        } catch (e) {
            setError("Error al crear la reservación. Intenta de nuevo.");
        } finally {
            setCargando(false);
        }
    };

    // Cerrar con Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>

                {/* Header */}
                <div className="modal-header">
                    <h2>Reservar Habitación {hab?.num || hab?.num_ha}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {/* Body */}
                <div className="modal-body">

                    {/* Resumen de habitación */}
                    <div style={{
                        background: "var(--color-bg-alt, #f8fafc)",
                        borderRadius: 8,
                        padding: "12px 16px",
                        marginBottom: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div>
                            <strong>{hab?.tipo}</strong>
                            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                                Habitación {hab?.num || hab?.num_ha}, Piso {hab?.piso}
                            </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <strong style={{ color: "var(--color-primary, #3b82f6)", fontSize: "1.1rem" }}>
                                ${hab?.precio_noche}
                            </strong>
                            <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>/noche</p>
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Fecha de Entrada</label>
                            <input
                                type="date"
                                className="form-input"
                                min={hoy}
                                value={form.fecha_entrada}
                                onChange={(e) => setForm({ ...form, fecha_entrada: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Fecha de Salida</label>
                            <input
                                type="date"
                                className="form-input"
                                min={form.fecha_entrada || hoy}
                                value={form.fecha_salida}
                                onChange={(e) => setForm({ ...form, fecha_salida: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Número de Huéspedes</label>
                            <input
                                type="number"
                                className="form-input"
                                min={1}
                                max={10}
                                value={form.num_huespedes}
                                onChange={(e) => setForm({ ...form, num_huespedes: Number(e.target.value) })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Duración</label>
                            <div style={{
                                padding: "10px 14px",
                                background: "#e0f2fe",
                                borderRadius: 8,
                                color: "#0369a1",
                                fontWeight: 600
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
                                onChange={(e) => setForm({ ...form, notas: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Total */}
                    <div style={{
                        background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
                        borderRadius: 8,
                        padding: "14px 20px",
                        marginTop: 8,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "white"
                    }}>
                        <span style={{ fontWeight: 600 }}>Total estimado:</span>
                        <span style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                            ${total.toFixed(2)}
                        </span>
                    </div>

                    {error && (
                        <p style={{ color: "#dc2626", marginTop: 10, fontSize: "0.9rem" }}>{error}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose} disabled={cargando}>
                        Cancelar
                    </button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={cargando}>
                        {cargando ? "Reservando..." : "Confirmar Reserva"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReservaModal;
