const rutas = require("express").Router();
const {
    obtenerPedidos,
    obtenerPedidosPorReservacion,
    nuevoPedido,
    cambiarEstadoPedido
} = require("../bd/pedidosBD");

// Obtener todos los pedidos
rutas.get("/", async (req, res) => {
    const pedidos = await obtenerPedidos();
    res.status(200).json(pedidos);
});

// Obtener pedidos de una reservación específica
rutas.get("/reservacion/:idRes", async (req, res) => {
    const pedidos = await obtenerPedidosPorReservacion(req.params.idRes);
    res.status(200).json(pedidos);
});

// Crear nuevo pedido
rutas.post("/nuevo", async (req, res) => {
    const resultado = await nuevoPedido(req.body);
    res.status(resultado.exito ? 201 : 400).json(resultado);
});

// Actualizar estado de un pedido
rutas.patch("/:id/estado", async (req, res) => {
    const resultado = await cambiarEstadoPedido(req.params.id, req.body.estado);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});

module.exports = rutas;
