const { log } = require("console");
const crypto = require("crypto");

function encriptarPassword(password) {
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto.scryptSync(password, salt, 100000, 64, "sha512").toString("hex");
    return {
        salt,
        hash
    }
}

function validarPassword(password, hash, salt) {
    const hashEvaluar = crypto.scryptSync(password, salt, 100000, 64, "sha512").toString("hex");
    return hashEvaluar == hash;
}

function usuarioAutorizado(req,res,cb) {
    var usuarioAutorizado=false;
    if (req.session.usuario) {
        console.log("Usuario autorizado");
        usuarioAutorizado=true;
    }
    return usuarioAutorizado;
}

function adminAutorizado(req, res, next) {
    if (req.session.admin) {
        next(); // Permite pasar a la siguiente función de la ruta
    } else {
        res.status(401).json("Acceso no autorizado: Se requiere perfil de Administrador");
    }
}

module.exports = {
    encriptarPassword,
    validarPassword,
    usuarioAutorizado,
    adminAutorizado
}
