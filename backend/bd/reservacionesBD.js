const Reservacion = require("../clases/Reservacion");
const { reservacionesBD } = require("./conexion");

function validarDatos(reservacion) {
    return reservacion.id_usuario !== undefined &&
        reservacion.num_hab !== undefined &&
        reservacion.fecha_entrada !== undefined &&
        reservacion.fecha_salida !== undefined &&
        reservacion.estado_reserva !== undefined;
}

/**
 * Obtener todas las reservaciones
 */
async function obtenerReservaciones() {
    try {
        const snapshot = await reservacionesBD.get();
        const reservaciones = [];
        snapshot.forEach(doc => {
            reservaciones.push({ id: doc.id, ...doc.data() });
        });
        return reservaciones;
    } catch (error) {
        console.error("Error obteniendo reservaciones:", error);
        return [];
    }
}

/**
 * Obtener reservación por ID
 */
async function obtenerReservacionPorId(id) {
    try {
        const doc = await reservacionesBD.doc(id).get();
        if (!doc.exists) return null;

        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error("Error obteniendo reservación:", error);
        return null;
    }
}

/**
 * Obtener reservaciones por usuario
 */
async function obtenerReservacionesPorUsuario(idUsuario) {
    try {
        const snapshot = await reservacionesBD.where("id_usuario", "==", idUsuario).get();
        const reservaciones = [];
        snapshot.forEach(doc => {
            reservaciones.push({ id: doc.id, ...doc.data() });
        });
        return reservaciones;
    } catch (error) {
        console.error("Error obteniendo reservaciones del usuario:", error);
        return [];
    }
}

/**
 * Crear nueva reservación
 */
async function nuevaReservacion(datos) {
    try {
        const instanciaReservacion = new Reservacion(datos);
        const datosReservacion = instanciaReservacion.obtenerDatos;

        if (!validarDatos(datosReservacion)) {
            return { exito: false, mensaje: "Datos inválidos" };
        }

        const docRef = await reservacionesBD.add(datosReservacion);
        return {
            exito: true,
            mensaje: "Reservación creada exitosamente",
            id: docRef.id
        };
    } catch (error) {
        console.error("Error creando reservación:", error);
        return { exito: false, mensaje: "Error al crear reservación" };
    }
}

/**
 * Modificar reservación existente
 */
async function modificarReservacion(id, datos) {
    try {
        const doc = await reservacionesBD.doc(id).get();
        if (!doc.exists) {
            return { exito: false, mensaje: "Reservación no encontrada" };
        }

        const datosActuales = doc.data();
        const datosActualizados = { ...datosActuales, ...datos };

        const instanciaReservacion = new Reservacion(datosActualizados);
        const datosValidados = instanciaReservacion.obtenerDatos;

        if (!validarDatos(datosValidados)) {
            return { exito: false, mensaje: "Datos inválidos" };
        }

        await reservacionesBD.doc(id).update(datosValidados);
        return { exito: true, mensaje: "Reservación actualizada exitosamente" };
    } catch (error) {
        console.error("Error modificando reservación:", error);
        return { exito: false, mensaje: "Error al modificar reservación" };
    }
}

/**
 * Cancelar reservación
 */
async function cancelarReservacion(id) {
    try {
        const doc = await reservacionesBD.doc(id).get();
        if (!doc.exists) {
            return { exito: false, mensaje: "Reservación no encontrada" };
        }

        await reservacionesBD.doc(id).update({ estado_reserva: "Cancelada" });
        return { exito: true, mensaje: "Reservación cancelada exitosamente" };
    } catch (error) {
        console.error("Error cancelando reservación:", error);
        return { exito: false, mensaje: "Error al cancelar reservación" };
    }
}

/**
 * Cambiar estado de reservación
 */
async function cambiarEstadoReservacion(id, estado) {
    try {
        const estadosValidos = ["Confirmada", "Check-in", "Check-out", "Cancelada"];
        if (!estadosValidos.includes(estado)) {
            return { exito: false, mensaje: "Estado inválido" };
        }

        const doc = await reservacionesBD.doc(id).get();
        if (!doc.exists) {
            return { exito: false, mensaje: "Reservación no encontrada" };
        }

        await reservacionesBD.doc(id).update({ estado_reserva: estado });
        return { exito: true, mensaje: "Estado actualizado exitosamente" };
    } catch (error) {
        console.error("Error cambiando estado:", error);
        return { exito: false, mensaje: "Error al cambiar estado" };
    }
}

module.exports = {
    obtenerReservaciones,
    obtenerReservacionPorId,
    obtenerReservacionesPorUsuario,
    nuevaReservacion,
    modificarReservacion,
    cancelarReservacion,
    cambiarEstadoReservacion
};
