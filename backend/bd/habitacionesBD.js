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
            estado: datos.estado || "Disponible"
        };

        const instanciaHabitacion = new Habitacion(datosParaModelo);
        const datosValidados = instanciaHabitacion.obtenerDatos;

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

async function obtenerHabitacionPorNum(num) {
    try {
        const snapshot = await habitacionesBD.where("num", "==", Number(num)).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error("Error obteniendo habitación por número:", error);
        return null;
    }
}

async function obtenerHabitacionesFiltros(filtros = {}) {
    return obtenerHabitacionesFiltradas(filtros);
}

async function obtenerHabitacionesFiltradas(filtros = {}) {
    try {
        const snapshot = await habitacionesBD.get();

        let resultado = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        resultado = resultado.filter(h => h.estado === "Disponible");

        if (filtros.q) {
            const q = filtros.q.toLowerCase().trim();

            resultado = resultado.filter(h =>
                String(h.num_ha).includes(q) ||
                (h.tipo || "").toLowerCase().includes(q) ||
                String(h.amenidades ?? "").toLowerCase().includes(q)
            );
        }

        if (filtros.tipo) {
            resultado = resultado.filter(h => h.tipo === filtros.tipo);
        }

        if (filtros.min) {
            resultado = resultado.filter(
                h => Number(h.precio_noche) >= Number(filtros.min)
            );
        }

        if (filtros.max) {
            resultado = resultado.filter(
                h => Number(h.precio_noche) <= Number(filtros.max)
            );
        }
        resultado.sort((a, b) => {
            switch (filtros.sort) {
                case "precio_desc":
                    return Number(b.precio_noche) - Number(a.precio_noche);
                case "tipo":
                    return (a.tipo || "").localeCompare(b.tipo || "");
                default:
                    return Number(a.precio_noche) - Number(b.precio_noche);
            }
        });

        const total = resultado.length;
        const limit = Math.max(1, parseInt(filtros.limit) || 10);
        const page = Math.max(1, parseInt(filtros.page) || 1);
        const totalPaginas = Math.ceil(total / limit);
        const inicio = (page - 1) * limit;
        const datos = resultado.slice(inicio, inicio + limit);

        return { datos, total, pagina: page, totalPaginas, limit };

    } catch (error) {
        console.error(error);
        return { datos: [], total: 0, pagina: 1, totalPaginas: 0, limit: 10 };
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

async function eliminarHabitacionBD(id) {
    try {
        await habitacionesBD.doc(id).delete();
        return { exito: true, mensaje: "Habitación eliminada" };
    } catch (error) {
        console.error("Error eliminando habitación:", error);
        return { exito: false, mensaje: "Error al eliminar" };
    }
}

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

async function obtenerTodasHabitaciones() {
    try {
        const snapshot = await habitacionesBD.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error obteniendo todas las habitaciones:", error);
        return [];
    }
}

async function obtenerHabitacionesDisponibles(fechaEntrada, fechaSalida) {
    try {
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
    nuevaHabitacion,
    modificarHabitacion,
    cambiarEstadoHabitacion,
    obtenerHabitacionesDisponibles,
    obtenerTodasHabitaciones,
    eliminarHabitacionBD,
    obtenerHabitacionesFiltradas,
    obtenerHabitacionPorNum,
    obtenerHabitacionesFiltros
};