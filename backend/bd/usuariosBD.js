const Usuario = require("../clases/Usuario");
const { usuariosBD } = require("./conexion");
const { encriptarPassword, validarPassword } = require("../middlewares/funcionesPassword");

function validarDatos(usuario) {
    return usuario.nombre != undefined &&
        usuario.correo != undefined &&
        usuario.hash != undefined;
}

async function nuevoUsuario(datos) {
    // Aceptar tanto 'password' como 'contrasena'
    const passwordPlano = datos.password || datos.contrasena;

    
    if (!passwordPlano) {
        console.error("Error: No se recibió contraseña");
        return false;
    }

    const { salt, hash } = encriptarPassword(passwordPlano);

    datos.hash = hash;
    datos.salt = salt;
    datos.password = undefined;
    datos.contrasena = undefined;
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

async function mostrarUsuarios() {
    const usuarios = await usuariosBD.get();
    const usuariosValidos = [];

    usuarios.forEach(doc => {
        const usuario = new Usuario({ id: doc.id, ...doc.data() });
        if (validarDatos(usuario.obtenerDatos)) {
            // No incluir información sensible (hash, salt)
            const { hash, salt, ...datosPublicos } = usuario.obtenerDatos;
            usuariosValidos.push({ id: doc.id, ...datosPublicos });
        }
    });

    return usuariosValidos;
}

module.exports = { nuevoUsuario, login, mostrarUsuarios };