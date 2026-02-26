const { checkoutAutomatico } = require("../bd/reservacionesBD");

// Ejecutar al arrancar el servidor
checkoutAutomatico();

// Ejecutar cada hora (3600000 ms)
const INTERVALO = 60 * 60 * 1000;
setInterval(checkoutAutomatico, INTERVALO);

console.log("[AutoCheckout] Job iniciado. Se ejecutará cada hora.");
