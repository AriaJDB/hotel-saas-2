const admin = require("firebase-admin");
const path = require("path");

const rutaLlave = path.join(__dirname, "..", "..", "keys.json");

try {
    const llaves = require(rutaLlave);
    admin.initializeApp({
        credential: admin.credential.cert(llaves)
    });
} catch (error) {
    console.error("Error al cargar keys.json:", error);
}

const bd = admin.firestore();
// Vital: Evita errores si un campo opcional llega como undefined
bd.settings({ ignoreUndefinedProperties: true });

const usuariosBD = bd.collection("usuarios");
const habitacionesBD = bd.collection("habitaciones");
const reservacionesBD = bd.collection("reservaciones");
const articulosBD = bd.collection("articulos");
const pedidosBD = bd.collection("pedidos");

module.exports = {
    usuariosBD,
    habitacionesBD,
    reservacionesBD,
    articulosBD,
    pedidosBD
};