const rutas = require("express").Router();
const {
    obtenerHabitaciones,
    obtenerHabitacionPorNum,
    nuevaHabitacion,
    modificarHabitacion,
    cambiarEstadoHabitacion,
    obtenerHabitacionesDisponibles
} = require("../bd/habitacionesBD");

// Obtener todas las habitaciones
rutas.get("/", async (req, res) => {
    const habitaciones = await obtenerHabitaciones();
    res.status(200).json(habitaciones);
});

// Obtener habitación específica por número
rutas.get("/:num", async (req, res) => {
    const habitacion = await obtenerHabitacionPorNum(req.params.num);
    if (habitacion) {
        res.status(200).json(habitacion);
    } else {
        res.status(404).json({ mensaje: "Habitación no encontrada" });
    }
});

// Obtener habitaciones disponibles (con query params opcionales para fechas)
rutas.get("/disponibles/buscar", async (req, res) => {
    const { fechaEntrada, fechaSalida } = req.query;
    const habitaciones = await obtenerHabitacionesDisponibles(fechaEntrada, fechaSalida);
    res.status(200).json(habitaciones);
});

// Crear nueva habitación
rutas.post("/nueva", async (req, res) => {
    const resultado = await nuevaHabitacion(req.body);
    res.status(resultado.exito ? 201 : 400).json(resultado);
});

// Actualizar habitación completa
rutas.put("/:num", async (req, res) => {
    const resultado = await modificarHabitacion(req.params.num, req.body);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});

// Actualizar solo el estado de la habitación
rutas.patch("/:num/estado", async (req, res) => {
    const resultado = await cambiarEstadoHabitacion(req.params.num, req.body.estado);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});

module.exports = rutas;
