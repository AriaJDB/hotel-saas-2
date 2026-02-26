const { reservacionesBD, habitacionesBD } = require("./conexion");

const ESTADOS_VALIDOS = ["Confirmada", "Check-in", "Check-out", "Cancelada"];

// --------------- Helpers ---------------

function fechaHoy() {
    return new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

// Cambia el estado de una habitación por su número
async function actualizarEstadoHabitacion(num_hab, estado) {
    try {
        const snap = await habitacionesBD.where("num", "==", Number(num_hab)).get();
        if (!snap.empty) {
            await snap.docs[0].ref.update({ estado });
        }
    } catch (err) {
        console.error("Error actualizando estado de habitación:", err);
    }
}

// --------------- CRUD ---------------

async function obtenerReservaciones() {
    try {
        const snapshot = await reservacionesBD.get();
        const lista = [];
        snapshot.forEach(doc => lista.push({ id: doc.id, ...doc.data() }));
        return lista;
    } catch (error) {
        console.error("Error obteniendo reservaciones:", error);
        return [];
    }
}

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

async function obtenerReservacionesPorUsuario(idUsuario) {
    try {
        const snapshot = await reservacionesBD.where("id_usuario", "==", idUsuario).get();
        const lista = [];
        snapshot.forEach(doc => lista.push({ id: doc.id, ...doc.data() }));
        return lista;
    } catch (error) {
        console.error("Error obteniendo reservaciones del usuario:", error);
        return [];
    }
}

async function nuevaReservacion(datos) {
    try {
        const { id_usuario, num_hab, fecha_entrada, fecha_salida,
            num_huespedes, total, notas, precio_noche } = datos;

        if (!id_usuario || !num_hab || !fecha_entrada || !fecha_salida) {
            return { exito: false, mensaje: "Faltan datos obligatorios" };
        }

        // Calcular total si no viene
        let totalFinal = Number(total) || 0;
        if (!totalFinal && precio_noche) {
            const dias = Math.ceil(
                (new Date(fecha_salida) - new Date(fecha_entrada)) / (1000 * 60 * 60 * 24)
            );
            totalFinal = dias * Number(precio_noche);
        }

        const doc = {
            id_usuario,
            num_hab: Number(num_hab),
            fecha_entrada,
            fecha_salida,
            num_huespedes: Number(num_huespedes) || 1,
            estado_reserva: "Confirmada",
            total: totalFinal,
            notas: notas || "",
            creado_en: new Date().toISOString()
        };

        const docRef = await reservacionesBD.add(doc);

        // Marcar la habitación como Ocupada automáticamente
        await actualizarEstadoHabitacion(num_hab, "Ocupada");

        return { exito: true, mensaje: "Reservación creada exitosamente", id: docRef.id };
    } catch (error) {
        console.error("Error creando reservación:", error);
        return { exito: false, mensaje: "Error al crear reservación" };
    }
}

async function modificarReservacion(id, datos) {
    try {
        const docRef = reservacionesBD.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return { exito: false, mensaje: "Reservación no encontrada" };

        const actual = doc.data();
        const actualizado = { ...actual, ...datos };
        delete actualizado.id;

        await docRef.update(actualizado);
        return { exito: true, mensaje: "Reservación actualizada exitosamente" };
    } catch (error) {
        console.error("Error modificando reservación:", error);
        return { exito: false, mensaje: "Error al modificar reservación" };
    }
}

async function cancelarReservacion(id) {
    try {
        const docRef = reservacionesBD.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return { exito: false, mensaje: "Reservación no encontrada" };

        const { num_hab } = doc.data();
        await docRef.update({ estado_reserva: "Cancelada" });

        // Liberar habitación de vuelta a Disponible
        await actualizarEstadoHabitacion(num_hab, "Disponible");

        return { exito: true, mensaje: "Reservación cancelada exitosamente" };
    } catch (error) {
        console.error("Error cancelando reservación:", error);
        return { exito: false, mensaje: "Error al cancelar reservación" };
    }
}

async function cambiarEstadoReservacion(id, estado) {
    try {
        if (!ESTADOS_VALIDOS.includes(estado)) {
            return { exito: false, mensaje: "Estado inválido" };
        }

        const docRef = reservacionesBD.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return { exito: false, mensaje: "Reservación no encontrada" };

        await docRef.update({ estado_reserva: estado });

        // Si hace Check-out → habitación a Limpieza (para la mucama)
        if (estado === "Check-out") {
            await actualizarEstadoHabitacion(doc.data().num_hab, "Limpieza");
        }
        // Si hace Check-in → habitación a Ocupada
        if (estado === "Check-in") {
            await actualizarEstadoHabitacion(doc.data().num_hab, "Ocupada");
        }

        return { exito: true, mensaje: "Estado actualizado exitosamente" };
    } catch (error) {
        console.error("Error cambiando estado:", error);
        return { exito: false, mensaje: "Error al cambiar estado" };
    }
}

// --------------- JOB: Auto checkout ---------------

async function checkoutAutomatico() {
    try {
        const hoy = fechaHoy();
        console.log(`[AutoCheckout] Revisando reservaciones para fecha: ${hoy}`);

        const snapshot = await reservacionesBD
            .where("estado_reserva", "in", ["Confirmada", "Check-in"])
            .get();

        let procesadas = 0;
        for (const doc of snapshot.docs) {
            const res = doc.data();
            if (res.fecha_salida && res.fecha_salida <= hoy) {
                await doc.ref.update({ estado_reserva: "Check-out" });
                await actualizarEstadoHabitacion(res.num_hab, "Limpieza");
                console.log(`[AutoCheckout] Reservacion ${doc.id} → Check-out. Hab ${res.num_hab} → Limpieza`);
                procesadas++;
            }
        }

        if (procesadas === 0) {
            console.log("[AutoCheckout] No hay reservaciones que hacer checkout hoy.");
        } else {
            console.log(`[AutoCheckout] ${procesadas} habitación(es) enviadas a limpieza.`);
        }
    } catch (error) {
        console.error("[AutoCheckout] Error en job automático:", error);
    }
}

module.exports = {
    obtenerReservaciones,
    obtenerReservacionPorId,
    obtenerReservacionesPorUsuario,
    nuevaReservacion,
    modificarReservacion,
    cancelarReservacion,
    cambiarEstadoReservacion,
    checkoutAutomatico
};
