const Habitacion = require("../clases/Habitacion");
const { habitacionesBD } = require("./conexion");

function validarDatos(habitacion) {
    return habitacion.num !== undefined &&
           habitacion.tipo !== undefined &&
           habitacion.precio_noche !== undefined &&
           habitacion.estado !== undefined;
}

async function nuevaHabitacion(datos) {
    try {
        const datosParaModelo = {
            ...datos,
            num: datos.num_ha, // Mapeo crítico
            estado: datos.estado || "Libre" 
        };

        const instanciaHabitacion = new Habitacion(datosParaModelo);
        const datosValidados = instanciaHabitacion.obtenerDatos;

        // Verificamos qué se está intentando guardar
        if (!validarDatos(datosValidados)) {
            console.error("Fallo de validación en:", datosValidados);
            return { exito: false, mensaje: "Datos inválidos: revisa que el número y tipo sean correctos" };
        }

        const existente = await obtenerHabitacionPorNum(datosValidados.num);
        if (existente) {
            return { exito: false, mensaje: "Ya existe una habitación con ese número" };
        }

        await habitacionesBD.doc().set(datosValidados);
        return { exito: true, mensaje: "Habitación creada exitosamente" };
    } catch (error) {
        console.error("Error en el servidor:", error);
        return { exito: false, mensaje: "Error interno al guardar" };
    }
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


async function obtenerHabitacionPorNum(num) {
    try {
        // Convertimos el parámetro a número antes de la consulta
        const numBusqueda = parseInt(num);
        const snapshot = await habitacionesBD.where("num", "==", numBusqueda).get();
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

/**
 * Modificar habitación existente
 */
/**
 * Modificar habitación existente
 */
async function modificarHabitacion(id, datos) { // Usamos id de documento
    try {
        const docRef = habitacionesBD.doc(id);
        const res = await docRef.get();
        
        if (!res.exists) {
            return { exito: false, mensaje: "Habitación no encontrada" };
        }

        // Combinamos datos actuales con los nuevos
        const datosActualizados = { ...res.data(), ...datos };
        
        // Pasamos por la clase para validar tipos (int, array, etc.)
        const instanciaHabitacion = new Habitacion(datosActualizados);
        const datosValidados = instanciaHabitacion.obtenerDatos;

        if (!validarDatos(datosValidados)) {
            return { exito: false, mensaje: "Datos inválidos" };
        }

        await docRef.update(datosValidados);
        return { exito: true, mensaje: "Habitación actualizada exitosamente" };
    } catch (error) {
        console.error("Error modificando habitación:", error);
        return { exito: false, mensaje: "Error al modificar habitación" };
    }
}

/**
 * Eliminar habitación
 */
async function eliminarHabitacionBD(id) {
    try {
        await habitacionesBD.doc(id).delete();
        return { exito: true, mensaje: "Habitación eliminada" };
    } catch (error) {
        console.error("Error eliminando habitación:", error);
        return { exito: false, mensaje: "Error al eliminar" };
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
    obtenerHabitacionesDisponibles,
    eliminarHabitacionBD
};
