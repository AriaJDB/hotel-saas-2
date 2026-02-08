const rutas = require("express").Router();
const {
    obtenerArticulos,
    obtenerArticuloPorId,
    obtenerArticulosPorCategoria,
    nuevoArticulo,
    modificarArticulo,
    cambiarDisponibilidad
} = require("../bd/articulosBD");

// Obtener todos los artículos
rutas.get("/", async (req, res) => {
    const articulos = await obtenerArticulos();
    res.status(200).json(articulos);
});

// Obtener artículo específico por ID
rutas.get("/:id", async (req, res) => {
    const articulo = await obtenerArticuloPorId(req.params.id);
    if (articulo) {
        res.status(200).json(articulo);
    } else {
        res.status(404).json({ mensaje: "Artículo no encontrado" });
    }
});

// Obtener artículos por categoría
rutas.get("/categoria/:categoria", async (req, res) => {
    const articulos = await obtenerArticulosPorCategoria(req.params.categoria);
    res.status(200).json(articulos);
});

// Crear nuevo artículo
rutas.post("/nuevo", async (req, res) => {
    const resultado = await nuevoArticulo(req.body);
    res.status(resultado.exito ? 201 : 400).json(resultado);
});

// Actualizar artículo completo
rutas.put("/:id", async (req, res) => {
    const resultado = await modificarArticulo(req.params.id, req.body);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});

// Actualizar solo la disponibilidad del artículo
rutas.patch("/:id/disponibilidad", async (req, res) => {
    const resultado = await cambiarDisponibilidad(req.params.id, req.body.disponibilidad);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});

module.exports = rutas;
