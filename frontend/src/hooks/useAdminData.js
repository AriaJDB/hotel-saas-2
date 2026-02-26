import { useState, useEffect } from "react";
import {
  obtenerHabitaciones,
  crearHabitacion,
  actualizarHabitacion,
  eliminarHabitacion
} from "../api/habitacionesService";

import {
  obtenerReservaciones,
  crearReservacion,
  actualizarReservacion,
  eliminarReservacion
} from "../api/reservacionesService";

import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from "../api/usuariosService";

import {
  obtenerArticulos,
  crearArticulo,
  actualizarArticulo,
  eliminarArticulo
} from "../api/articulosService";

export const useAdminData = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [reservaciones, setReservaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [articulos, setArticulos] = useState([]);

  const cargarDatos = async () => {
    const [hab, res, usu, art] = await Promise.all([
      obtenerHabitaciones(),
      obtenerReservaciones(),
      obtenerUsuarios(),
      obtenerArticulos()
    ]);

    setHabitaciones(Array.isArray(hab) ? hab : hab?.datos || []);
    setReservaciones(Array.isArray(res) ? res : res?.datos || []);
    setUsuarios(Array.isArray(usu) ? usu : usu?.datos || []);
    setArticulos(Array.isArray(art) ? art : art?.datos || []);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return {
    habitaciones,
    reservaciones,
    usuarios,
    articulos,
    cargarDatos,
    crearHabitacion,
    actualizarHabitacion,
    eliminarHabitacion,
    crearReservacion,
    actualizarReservacion,
    eliminarReservacion,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    crearArticulo,
    actualizarArticulo,
    eliminarArticulo
  };
};