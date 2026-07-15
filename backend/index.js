require('dotenv').config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const usuariosRutas = require("./rutas/rutasUsuarios");
const habitacionesRutas = require("./rutas/rutasHabitaciones");
const reservacionesRutas = require("./rutas/rutasReservaciones");
const articulosRutas = require("./rutas/rutasArticulos");
const pedidosRutas = require("./rutas/rutasPedidos");
const autoCheckout = require("./jobs/autoCheckout");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: [
        'https://localhost',
        'http://localhost',
        'http://localhost:5173',  // dev local
        'http://localhost:3000',
    ],
    credentials: true
}));

app.use(session({
    name: 'session',
    secret: process.env.KEYS || 'secreto_temporal_escolar',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Registrar todas las rutas
app.use("/usuarios", usuariosRutas);
app.use("/habitaciones", habitacionesRutas);
app.use("/reservaciones", reservacionesRutas);
app.use("/articulos", articulosRutas);
app.use("/pedidos", pedidosRutas);

const puerto = process.env.PORT || 3000;
app.listen(puerto, () => {
    console.log(`Servidor en http://localhost:${puerto}`);
});