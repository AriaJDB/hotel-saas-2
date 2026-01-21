const rutas = require("express").Router();
const { nuevoUsuario, login } = require("../bd/usuariosBD");

rutas.post("/nuevo", async (req, res) => {
    const exito = await nuevoUsuario(req.body);
    res.status(exito ? 200 : 400).json(exito);
});

rutas.post("/login", async (req, res) => {
    const coincide = await login(req, req.body.correo, req.body.password);
    res.status(coincide ? 200 : 401).json(coincide);
});

module.exports = rutas;