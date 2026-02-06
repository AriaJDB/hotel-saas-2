const Usuario = require("../clases/Usuario");
const { usuariosBD } = require("./conexion");
const { encriptarPassword, validarPassword } = require("../middlewares/funcionesPassword");

function validarDatos(usuario) {
    return usuario.nombre != undefined &&
        usuario.correo != undefined &&
        usuario.hash != undefined;
}

async function nuevoUsuario(datos) {
    const { salt, hash } = encriptarPassword(datos.password);

    datos.hash = hash;
    datos.salt = salt;
    datos.password = undefined;
    datos.tipo = datos.tipo || "usuario";

    const instanciaUsuario = new Usuario(datos);
    let exito = false;

    if (validarDatos(instanciaUsuario.obtenerDatos)) {
        await usuariosBD.doc().set(instanciaUsuario.obtenerDatos);
        exito = true;
    }
    return exito;
}

async function login(req, correo, passwordPlano) {
    let respuesta = false;
    const usuarios = await usuariosBD.where("correo", "==", correo).get();

    if (!usuarios.empty) {
        const doc = usuarios.docs[0];
        const usuarioDB = doc.data();
        const coinciden = validarPassword(passwordPlano, usuarioDB.hash, usuarioDB.salt);

        if (coinciden) {
            // Configurar sesión
            if (usuarioDB.tipo === "admin") {
                req.session.admin = usuarioDB.nombre;
            } else {
                req.session.usuario = usuarioDB.nombre;
            }

            // Devolver datos del usuario (sin información sensible)
            respuesta = {
                id: doc.id,
                nombre: usuarioDB.nombre,
                correo: usuarioDB.correo,
                tipo: usuarioDB.tipo || "usuario"
            };
        }
    }
    return respuesta;
}

module.exports = { nuevoUsuario, login };