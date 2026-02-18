const rutas = require("express").Router();
const {
    obtenerHabitacionesFiltradas,
    obtenerHabitacionPorNum,
    nuevaHabitacion,
    modificarHabitacion,
    cambiarEstadoHabitacion,
    obtenerHabitacionesDisponibles,
    obtenerHabitacionesFiltros
} = require("../bd/habitacionesBD");



// Obtener todas las habitaciones (con filtros y paginación)
rutas.get("/", async (req, res) => {
    try {
        const resultado = await obtenerHabitacionesFiltradas(req.query);
        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error servidor" });
    }
});

// Obtener habitaciones disponibles (con query params opcionales para fechas)
// IMPORTANTE: debe ir ANTES de /:num para que Express no lo capture como número
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

// Actualizar solo el estado de la habitación
rutas.patch("/:num/estado", async (req, res) => {
    const resultado = await cambiarEstadoHabitacion(req.params.num, req.body.estado);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});

// Obtener habitación específica por número
// IMPORTANTE: debe ir AL FINAL para no capturar rutas estáticas como "disponibles"
rutas.get("/:num", async (req, res) => {
    const habitacion = await obtenerHabitacionPorNum(req.params.num);
    if (habitacion) {
        res.status(200).json(habitacion);
    } else {
        res.status(404).json({ mensaje: "Habitación no encontrada" });
    }
});

module.exports = rutas;
