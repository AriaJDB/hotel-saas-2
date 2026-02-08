const rutas = require("express").Router();
const {
    obtenerReservaciones,
    obtenerReservacionPorId,
    obtenerReservacionesPorUsuario,
    nuevaReservacion,
    modificarReservacion,
    cancelarReservacion,
    cambiarEstadoReservacion
} = require("../bd/reservacionesBD");

// Obtener todas las reservaciones
rutas.get("/", async (req, res) => {
    const reservaciones = await obtenerReservaciones();
    res.status(200).json(reservaciones);
});

// Obtener reservación específica por ID
rutas.get("/:id", async (req, res) => {
    const reservacion = await obtenerReservacionPorId(req.params.id);
    if (reservacion) {
        res.status(200).json(reservacion);
    } else {
        res.status(404).json({ mensaje: "Reservación no encontrada" });
    }
});

// Obtener reservaciones de un usuario específico
rutas.get("/usuario/:idUsuario", async (req, res) => {
    const reservaciones = await obtenerReservacionesPorUsuario(req.params.idUsuario);
    res.status(200).json(reservaciones);
});

// Crear nueva reservación
rutas.post("/nueva", async (req, res) => {
    const resultado = await nuevaReservacion(req.body);
    res.status(resultado.exito ? 201 : 400).json(resultado);
});

// Actualizar reservación completa
rutas.put("/:id", async (req, res) => {
    const resultado = await modificarReservacion(req.params.id, req.body);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});

// Actualizar solo el estado de la reservación
rutas.patch("/:id/estado", async (req, res) => {
    const resultado = await cambiarEstadoReservacion(req.params.id, req.body.estado);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});

// Cancelar reservación
rutas.delete("/:id", async (req, res) => {
    const resultado = await cancelarReservacion(req.params.id);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});

module.exports = rutas;
