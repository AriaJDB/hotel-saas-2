const { usuariosBD } = require("./conexion");
const { encriptarPassword, validarPassword } = require("../middlewares/funcionesPassword");
const { enviarCorreoRecuperacion } = require("../middlewares/correoService");
const crypto = require("crypto");

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

// Login biométrico: solo busca al usuario por correo (WebAuthn ya verificó la identidad en el cliente)
async function loginBiometrico(correo) {
    try {
        const usuarios = await usuariosBD.where("correo", "==", correo).get();
        if (usuarios.empty) return false;

        const doc = usuarios.docs[0];
        const usuarioDB = doc.data();

        return {
            id: doc.id,
            nombre: usuarioDB.nombre,
            correo: usuarioDB.correo,
            tipo: usuarioDB.tipo || "usuario"
        };
    } catch (error) {
        console.error("Error en loginBiometrico:", error);
        return false;
    }
}

// ── Recuperación de contraseña por correo ──────────────────────────────────

/**
 * Genera un token y lo guarda en Firestore, luego envía el correo
 */
async function solicitarRecuperacion(correo) {
    try {
        const usuarios = await usuariosBD.where("correo", "==", correo).get();
        if (usuarios.empty) {
            // No revelamos si el correo existe o no (seguridad)
            return { exito: true };
        }

        const doc = usuarios.docs[0];
        const usuario = doc.data();

        const token = crypto.randomBytes(32).toString("hex");
        const expira = Date.now() + 30 * 60 * 1000; // 30 minutos

        await doc.ref.update({ resetToken: token, resetExpira: expira });
        await enviarCorreoRecuperacion(correo, usuario.nombre, token);

        return { exito: true };
    } catch (error) {
        console.error("Error en solicitarRecuperacion:", error);
        return { exito: false, mensaje: "Error al procesar la solicitud" };
    }
}

/**
 * Valida el token y actualiza la contraseña
 */
async function resetPassword(token, nuevaPassword) {
    try {
        const ahora = Date.now();
        const snapshot = await usuariosBD.where("resetToken", "==", token).get();

        if (snapshot.empty) {
            return { exito: false, mensaje: "Token inválido o ya utilizado" };
        }

        const doc = snapshot.docs[0];
        const datos = doc.data();

        if (!datos.resetExpira || ahora > datos.resetExpira) {
            return { exito: false, mensaje: "El enlace ha expirado. Solicita uno nuevo" };
        }

        const { salt, hash } = encriptarPassword(nuevaPassword);

        await doc.ref.update({
            hash,
            salt,
            resetToken: null,
            resetExpira: null
        });

        return { exito: true, mensaje: "Contraseña actualizada correctamente" };
    } catch (error) {
        console.error("Error en resetPassword:", error);
        return { exito: false, mensaje: "Error al restablecer contraseña" };
    }
}

module.exports = { nuevoUsuario, login, loginBiometrico, mostrarUsuarios, actualizarUsuario, solicitarRecuperacion, resetPassword };
