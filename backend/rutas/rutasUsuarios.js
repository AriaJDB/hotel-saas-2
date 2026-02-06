const rutas = require("express").Router();
const { nuevoUsuario, login, mostrarUsuarios } = require("../bd/usuariosBD");

rutas.get("/", async (req, res) => {
    const usuarios = await mostrarUsuarios();
    res.json(usuarios);
});

rutas.post("/nuevo", async (req, res) => {
    const exito = await nuevoUsuario(req.body);
    res.status(exito ? 200 : 400).json(exito);
});

rutas.post("/login", async (req, res) => {
    // Aceptar tanto 'password' como 'contrasena'
    const passwordPlano = req.body.password || req.body.contrasena;
    const coincide = await login(req, req.body.correo, passwordPlano);
    res.status(coincide ? 200 : 401).json(coincide);
});

module.exports = rutas;