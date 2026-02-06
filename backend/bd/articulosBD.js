const Articulo = require("../clases/Articulo");
const { articulosBD } = require("./conexion");

function validarDatos(articulo) {
    return articulo.nombre !== undefined &&
        articulo.precio !== undefined;
}

/**
 * Obtener todos los artículos
 */
async function obtenerArticulos() {
    try {
        const snapshot = await articulosBD.get();
        const articulos = [];
        snapshot.forEach(doc => {
            articulos.push({ id: doc.id, ...doc.data() });
        });
        return articulos;
    } catch (error) {
        console.error("Error obteniendo artículos:", error);
        return [];
    }
}

/**
 * Obtener artículo por ID
 */
async function obtenerArticuloPorId(id) {
    try {
        const doc = await articulosBD.doc(id).get();
        if (!doc.exists) return null;

        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error("Error obteniendo artículo:", error);
        return null;
    }
}

/**
 * Obtener artículos por categoría
 */
async function obtenerArticulosPorCategoria(categoria) {
    try {
        const snapshot = await articulosBD.where("categoria", "==", categoria).get();
        const articulos = [];
        snapshot.forEach(doc => {
            articulos.push({ id: doc.id, ...doc.data() });
        });
        return articulos;
    } catch (error) {
        console.error("Error obteniendo artículos por categoría:", error);
        return [];
    }
}

/**
 * Crear nuevo artículo
 */
async function nuevoArticulo(datos) {
    try {
        const instanciaArticulo = new Articulo(datos);
        const datosArticulo = instanciaArticulo.obtenerDatos;

        if (!validarDatos(datosArticulo)) {
            return { exito: false, mensaje: "Datos inválidos" };
        }

        const docRef = await articulosBD.add(datosArticulo);
        return {
            exito: true,
            mensaje: "Artículo creado exitosamente",
            id: docRef.id
        };
    } catch (error) {
        console.error("Error creando artículo:", error);
        return { exito: false, mensaje: "Error al crear artículo" };
    }
}

/**
 * Modificar artículo existente
 */
async function modificarArticulo(id, datos) {
    try {
        const doc = await articulosBD.doc(id).get();
        if (!doc.exists) {
            return { exito: false, mensaje: "Artículo no encontrado" };
        }

        const datosActuales = doc.data();
        const datosActualizados = { ...datosActuales, ...datos };

        const instanciaArticulo = new Articulo(datosActualizados);
        const datosValidados = instanciaArticulo.obtenerDatos;

        if (!validarDatos(datosValidados)) {
            return { exito: false, mensaje: "Datos inválidos" };
        }

        await articulosBD.doc(id).update(datosValidados);
        return { exito: true, mensaje: "Artículo actualizado exitosamente" };
    } catch (error) {
        console.error("Error modificando artículo:", error);
        return { exito: false, mensaje: "Error al modificar artículo" };
    }
}

/**
 * Cambiar disponibilidad de artículo
 */
async function cambiarDisponibilidad(id, disponibilidad) {
    try {
        const doc = await articulosBD.doc(id).get();
        if (!doc.exists) {
            return { exito: false, mensaje: "Artículo no encontrado" };
        }

        await articulosBD.doc(id).update({ disponibilidad: disponibilidad === true || disponibilidad === "true" });
        return { exito: true, mensaje: "Disponibilidad actualizada exitosamente" };
    } catch (error) {
        console.error("Error cambiando disponibilidad:", error);
        return { exito: false, mensaje: "Error al cambiar disponibilidad" };
    }
}

module.exports = {
    obtenerArticulos,
    obtenerArticuloPorId,
    obtenerArticulosPorCategoria,
    nuevoArticulo,
    modificarArticulo,
    cambiarDisponibilidad
};
