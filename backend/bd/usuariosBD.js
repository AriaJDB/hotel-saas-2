const { usuariosBD } = require("./conexion");
const { encriptarPassword, validarPassword } = require("../middlewares/funcionesPassword");

const TIPOS_VALIDOS = ["usuario", "admin", "mucama", "empleado"];

async function nuevoUsuario(datos) {
    const passwordPlano = datos.password || datos.contrasena;

    if (!passwordPlano) {
        console.error("Error: No se recibió contraseña");
        return false;
    }
    if (!datos.nombre || !datos.correo) {
        console.error("Error: Faltan nombre o correo");
        return false;
    }

    const { salt, hash } = encriptarPassword(passwordPlano);

    const nuevoDoc = {
        nombre: datos.nombre,
        apellidos: datos.apellidos || "",
        correo: datos.correo,
        telefono: datos.telefono || "",
        tipo: TIPOS_VALIDOS.includes(datos.tipo) ? datos.tipo : "usuario",
        hash,
        salt
    };

    try {
        await usuariosBD.doc().set(nuevoDoc);
        return true;
    } catch (error) {
        console.error("Error guardando usuario:", error);
        return false;
    }
}

async function login(req, correo, passwordPlano) {
    let respuesta = false;
    const usuarios = await usuariosBD.where("correo", "==", correo).get();

    if (!usuarios.empty) {
        const doc = usuarios.docs[0];
        const usuarioDB = doc.data();
        const coinciden = validarPassword(passwordPlano, usuarioDB.hash, usuarioDB.salt);

        if (coinciden) {
            if (usuarioDB.tipo === "admin") {
                req.session.admin = usuarioDB.nombre;
            } else {
                req.session.usuario = usuarioDB.nombre;
            }

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
    try {
        const snapshot = await usuariosBD.get();
        const lista = [];

        snapshot.forEach(doc => {
            const d = doc.data();
            // Solo excluir documentos sin nombre ni correo
            if (d.nombre && d.correo) {
                lista.push({
                    id: doc.id,
                    nombre: d.nombre,
                    apellidos: d.apellidos || "",
                    correo: d.correo,
                    telefono: d.telefono || "",
                    tipo: d.tipo || "usuario"
                });
            }
        });

        return lista;
    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
        return [];
    }
}

async function actualizarUsuario(id, datos) {
    try {
        const docRef = usuariosBD.doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return { exito: false, mensaje: "Usuario no encontrado" };
        }

        const actual = doc.data();

        const actualizacion = {
            nombre: datos.nombre || actual.nombre,
            apellidos: datos.apellidos !== undefined ? datos.apellidos : (actual.apellidos || ""),
            correo: datos.correo || actual.correo,
            telefono: datos.telefono !== undefined ? datos.telefono : (actual.telefono || ""),
            tipo: TIPOS_VALIDOS.includes(datos.tipo) ? datos.tipo : (actual.tipo || "usuario")
        };

        // Si viene nueva contraseña, re-encriptarla
        const passwordPlano = datos.password || datos.contrasena;
        if (passwordPlano) {
            const { salt, hash } = encriptarPassword(passwordPlano);
            actualizacion.hash = hash;
            actualizacion.salt = salt;
        }

        await docRef.update(actualizacion);
        return { exito: true, mensaje: "Usuario actualizado" };
    } catch (error) {
        console.error("Error actualizando usuario:", error);
        return { exito: false, mensaje: "Error al actualizar usuario" };
    }
}

module.exports = { nuevoUsuario, login, mostrarUsuarios, actualizarUsuario };
