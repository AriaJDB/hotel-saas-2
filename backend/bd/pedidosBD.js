const Pedido = require("../clases/Pedido");
const { pedidosBD } = require("./conexion");

function validarDatos(pedido) {
    return pedido.id_res !== undefined &&
        pedido.id_art !== undefined &&
        pedido.cantidad !== undefined &&
        pedido.estado !== undefined;
}

/**
 * Obtener todos los pedidos
 */
async function obtenerPedidos() {
    try {
        const snapshot = await pedidosBD.get();
        const pedidos = [];
        snapshot.forEach(doc => {
            pedidos.push({ id: doc.id, ...doc.data() });
        });
        return pedidos;
    } catch (error) {
        console.error("Error obteniendo pedidos:", error);
        return [];
    }
}

/**
 * Obtener pedidos por reservación
 */
async function obtenerPedidosPorReservacion(idRes) {
    try {
        const snapshot = await pedidosBD.where("id_res", "==", idRes).get();
        const pedidos = [];
        snapshot.forEach(doc => {
            pedidos.push({ id: doc.id, ...doc.data() });
        });
        return pedidos;
    } catch (error) {
        console.error("Error obteniendo pedidos de la reservación:", error);
        return [];
    }
}

/**
 * Crear nuevo pedido
 */
async function nuevoPedido(datos) {
    try {
        const instanciaPedido = new Pedido(datos);
        const datosPedido = instanciaPedido.obtenerDatos;

        if (!validarDatos(datosPedido)) {
            return { exito: false, mensaje: "Datos inválidos" };
        }

        const docRef = await pedidosBD.add(datosPedido);
        return {
            exito: true,
            mensaje: "Pedido creado exitosamente",
            id: docRef.id
        };
    } catch (error) {
        console.error("Error creando pedido:", error);
        return { exito: false, mensaje: "Error al crear pedido" };
    }
}

/**
 * Cambiar estado de pedido
 */
async function cambiarEstadoPedido(id, estado) {
    try {
        const estadosValidos = ["Recibido", "Preparando", "Entregado"];
        if (!estadosValidos.includes(estado)) {
            return { exito: false, mensaje: "Estado inválido" };
        }

        const doc = await pedidosBD.doc(id).get();
        if (!doc.exists) {
            return { exito: false, mensaje: "Pedido no encontrado" };
        }

        await pedidosBD.doc(id).update({ estado });
        return { exito: true, mensaje: "Estado actualizado exitosamente" };
    } catch (error) {
        console.error("Error cambiando estado:", error);
        return { exito: false, mensaje: "Error al cambiar estado" };
    }
}

module.exports = {
    obtenerPedidos,
    obtenerPedidosPorReservacion,
    nuevoPedido,
    cambiarEstadoPedido
};
