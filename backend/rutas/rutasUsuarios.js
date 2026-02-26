const rutas = require("express").Router();
const { nuevoUsuario, login, mostrarUsuarios, actualizarUsuario } = require("../bd/usuariosBD");

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

// Editar usuario por ID
rutas.put("/:id", async (req, res) => {
    const resultado = await actualizarUsuario(req.params.id, req.body);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});

// Eliminar usuario por ID
rutas.delete("/:id", async (req, res) => {
    try {
        const { usuariosBD } = require("../bd/conexion");
        await usuariosBD.doc(req.params.id).delete();
        res.json({ exito: true, mensaje: "Usuario eliminado" });
    } catch (error) {
        console.error("Error eliminando usuario:", error);
        res.status(500).json({ exito: false, mensaje: "Error al eliminar" });
    }
});

module.exports = rutas;
