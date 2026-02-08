const Habitacion = require("../clases/Habitacion");
const { habitacionesBD } = require("./conexion");

function validarDatos(habitacion) {
    return habitacion.num !== undefined &&
        habitacion.tipo !== undefined &&
        habitacion.precio_noche !== undefined &&
        habitacion.estado !== undefined;
}

/**
 * Obtener todas las habitaciones
 */
async function obtenerHabitaciones() {
    try {
        const snapshot = await habitacionesBD.get();
        const habitaciones = [];
        snapshot.forEach(doc => {
            habitaciones.push({ id: doc.id, ...doc.data() });
        });
        return habitaciones;
    } catch (error) {
        console.error("Error obteniendo habitaciones:", error);
        return [];
    }
}

/**
 * Obtener habitación por número
 */
async function obtenerHabitacionPorNum(num) {
    try {
        const snapshot = await habitacionesBD.where("num", "==", num).get();
        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error("Error obteniendo habitación:", error);
        return null;
    }
}

/**
 * Crear nueva habitación
 */
async function nuevaHabitacion(datos) {
    try {
        const instanciaHabitacion = new Habitacion(datos);
        const datosHabitacion = instanciaHabitacion.obtenerDatos;

        if (!validarDatos(datosHabitacion)) {
            return { exito: false, mensaje: "Datos inválidos" };
        }

        // Verificar que no exista una habitación con el mismo número
        const existente = await obtenerHabitacionPorNum(datosHabitacion.num);
        if (existente) {
            return { exito: false, mensaje: "Ya existe una habitación con ese número" };
        }

        await habitacionesBD.doc().set(datosHabitacion);
        return { exito: true, mensaje: "Habitación creada exitosamente" };
    } catch (error) {
        console.error("Error creando habitación:", error);
        return { exito: false, mensaje: "Error al crear habitación" };
    }
}

/**
 * Modificar habitación existente
 */
async function modificarHabitacion(num, datos) {
    try {
        const snapshot = await habitacionesBD.where("num", "==", num).get();
        if (snapshot.empty) {
            return { exito: false, mensaje: "Habitación no encontrada" };
        }

        const doc = snapshot.docs[0];
        const datosActuales = doc.data();
        const datosActualizados = { ...datosActuales, ...datos };

        const instanciaHabitacion = new Habitacion(datosActualizados);
        const datosValidados = instanciaHabitacion.obtenerDatos;

        if (!validarDatos(datosValidados)) {
            return { exito: false, mensaje: "Datos inválidos" };
        }

        await doc.ref.update(datosValidados);
        return { exito: true, mensaje: "Habitación actualizada exitosamente" };
    } catch (error) {
        console.error("Error modificando habitación:", error);
        return { exito: false, mensaje: "Error al modificar habitación" };
    }
}

/**
 * Cambiar estado de habitación
 */
async function cambiarEstadoHabitacion(num, estado) {
    try {
        const estadosValidos = ["Disponible", "Ocupada", "Limpiando", "Mantenimiento"];
        if (!estadosValidos.includes(estado)) {
            return { exito: false, mensaje: "Estado inválido" };
        }

        const snapshot = await habitacionesBD.where("num", "==", num).get();
        if (snapshot.empty) {
            return { exito: false, mensaje: "Habitación no encontrada" };
        }

        const doc = snapshot.docs[0];
        await doc.ref.update({ estado });
        return { exito: true, mensaje: "Estado actualizado exitosamente" };
    } catch (error) {
        console.error("Error cambiando estado:", error);
        return { exito: false, mensaje: "Error al cambiar estado" };
    }
}

/**
 * Obtener habitaciones disponibles para un rango de fechas
 */
async function obtenerHabitacionesDisponibles(fechaEntrada, fechaSalida) {
    try {
        // Por ahora retornamos todas las habitaciones con estado "Disponible"
        // En una implementación más completa, verificaríamos las reservaciones
        const snapshot = await habitacionesBD.where("estado", "==", "Disponible").get();
        const habitaciones = [];
        snapshot.forEach(doc => {
            habitaciones.push({ id: doc.id, ...doc.data() });
        });
        return habitaciones;
    } catch (error) {
        console.error("Error obteniendo habitaciones disponibles:", error);
        return [];
    }
}

module.exports = {
    obtenerHabitaciones,
    obtenerHabitacionPorNum,
    nuevaHabitacion,
    modificarHabitacion,
    cambiarEstadoHabitacion,
    obtenerHabitacionesDisponibles
};
