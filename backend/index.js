require('dotenv').config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const usuariosRutas = require("./rutas/rutasUsuarios");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//asdasd

app.use(session({
    name: 'session',
    secret: process.env.KEYS || 'secreto_temporal_escolar',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use("/usuarios", usuariosRutas);

const puerto = process.env.PORT || 3000;
app.listen(puerto, () => {
    console.log(`Servidor en http://localhost:${puerto}`);
});