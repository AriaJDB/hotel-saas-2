const rutas = require("express").Router();
const { nuevoUsuario, login, loginBiometrico, mostrarUsuarios, actualizarUsuario, solicitarRecuperacion, resetPassword } = require("../bd/usuariosBD");

rutas.get("/", async (req, res) => {
    const usuarios = await mostrarUsuarios();
    res.json(usuarios);
});

rutas.post("/nuevo", async (req, res) => {
    const exito = await nuevoUsuario(req.body);
    res.status(exito ? 200 : 400).json(exito);
});

// Login normal con contraseña
rutas.post("/login", async (req, res) => {
    // Aceptar tanto 'password' como 'contrasena'
    const passwordPlano = req.body.password || req.body.contrasena;
    const coincide = await login(req, req.body.correo, passwordPlano);
    res.status(coincide ? 200 : 401).json(coincide);
});

// Login biométrico (WebAuthn ya verificó la huella en el cliente)
rutas.post("/login-biometrico", async (req, res) => {
    const { correo } = req.body;
    if (!correo) return res.status(400).json(false);
    const datos = await loginBiometrico(correo);
    res.status(datos ? 200 : 404).json(datos);
});

// Solicitar recuperación de contraseña → envía correo con link
rutas.post("/solicitar-recuperacion", async (req, res) => {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ exito: false, mensaje: "Correo requerido" });
    const resultado = await solicitarRecuperacion(correo);
    res.status(resultado.exito ? 200 : 500).json(resultado);
});

// Validar token y cambiar contraseña
rutas.post("/reset-password", async (req, res) => {
    const { token, nuevaPassword } = req.body;
    if (!token || !nuevaPassword) return res.status(400).json({ exito: false, mensaje: "Datos incompletos" });
    const resultado = await resetPassword(token, nuevaPassword);
    res.status(resultado.exito ? 200 : 400).json(resultado);
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
