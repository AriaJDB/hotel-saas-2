const rutas = require("express").Router();
const {
    obtenerHabitacionesFiltradas,
    obtenerHabitacionPorNum,
    nuevaHabitacion,
    cambiarEstadoHabitacion,
    obtenerHabitacionesDisponibles,
    eliminarHabitacionBD,
    modificarHabitacion,
    obtenerTodasHabitaciones
} = require("../bd/habitacionesBD");

rutas.get("/", async (req, res) => {
    try {
        const resultado = await obtenerHabitacionesFiltradas(req.query);
        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error servidor" });
    }
});

rutas.get("/disponibles/buscar", async (req, res) => {
    const { fechaEntrada, fechaSalida } = req.query;
    const habitaciones = await obtenerHabitacionesDisponibles(fechaEntrada, fechaSalida);
    res.status(200).json(habitaciones);
});

// Todas las habitaciones sin filtro de estado (para panel de mucama)
rutas.get("/todas", async (req, res) => {
    try {
        const habitaciones = await obtenerTodasHabitaciones();
        res.json(habitaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error servidor" });
    }
});

// Crear nueva habitación
rutas.post("/nueva", async (req, res) => {
    const resultado = await nuevaHabitacion(req.body);
    res.status(resultado.exito ? 201 : 400).json(resultado);
});

rutas.patch("/:num/estado", async (req, res) => {
    const resultado = await cambiarEstadoHabitacion(req.params.num, req.body.estado);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});

rutas.delete("/eliminarHabitacionBD/:id", async (req, res) => {
    const resultado = await eliminarHabitacionBD(req.params.id);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});

rutas.put("/modificarHabitacion/:id", async (req, res) => {
    const resultado = await modificarHabitacion(req.params.id, req.body);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});

// PUT /:id - actualización directa por ID (usado por CleaningDashboard)
rutas.put("/:id", async (req, res) => {
    const resultado = await modificarHabitacion(req.params.id, req.body);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});

rutas.get("/:num", async (req, res) => {
    const habitacion = await obtenerHabitacionPorNum(req.params.num);
    if (habitacion) {
        res.status(200).json(habitacion);
    } else {
        res.status(404).json({ mensaje: "Habitación no encontrada" });
    }
});

module.exports = rutas;
