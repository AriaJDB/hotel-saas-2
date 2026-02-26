import { useState } from "react";

// 🔹 PRIMERO defines los estados iniciales
const habitacionInicial = {
  num_ha: '',
  piso: '',
  tipo: 'Individual',
  precio_noche: '',
  amenidades: [],
  estado: 'Disponible',
  ultima_lim: '',
  id_em: ''
};

const reservacionInicial = {
  id_usuario: '',
  num_ha: '',
  fecha_entrada: '',
  fecha_salida: '',
  num_huespedes: 1,
  metodo_pago: 'Tarjeta',
  estado_reserva: 'Pendiente',
  pendiente_pago: 0,
  total: 0,
  notas: ''
};

const usuarioInicial = {
  nombre: '',
  apellidos: '',
  correo: '',
  telefono: '',
  password: '',
  tipo: 'usuario'
};

const articuloInicial = {
  nombre: '',
  descripcion: '',
  precio: '',
  categoria: 'Restaurante',
  disponibilidad: 'Disponible'
};

// 🔹 DESPUÉS el hook
export const useAdminForms = () => {

  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoModal, setTipoModal] = useState('');
  const [modoModal, setModoModal] = useState('crear');
  const [itemSeleccionado, setItemSeleccionado] = useState(null);

  const [formHabitacion, setFormHabitacion] = useState(habitacionInicial);
  const [formReservacion, setFormReservacion] = useState(reservacionInicial);
  const [formUsuario, setFormUsuario] = useState(usuarioInicial);
  const [formArticulo, setFormArticulo] = useState(articuloInicial);

  const [nuevaAmenidad, setNuevaAmenidad] = useState('');

  const abrirModal = (tipo, modo, item = null) => {
    setTipoModal(tipo);
    setModoModal(modo);
    setItemSeleccionado(item);

    if (tipo === "habitacion") {
      if (modo === "editar" && item) {
        setFormHabitacion({
          ...habitacionInicial,
          ...item
        });
      } else {
        setFormHabitacion(habitacionInicial);
      }
    }

    if (tipo === "reservacion") {
      if (modo === "editar" && item) {
        setFormReservacion({
          ...reservacionInicial,
          ...item
        });
      } else {
        setFormReservacion(reservacionInicial);
      }
    }

    if (tipo === "usuario") {
      if (modo === "editar" && item) {
        setFormUsuario({
          ...usuarioInicial,
          ...item
        });
      } else {
        setFormUsuario(usuarioInicial);
      }
    }

    if (tipo === "articulo") {
      if (modo === "editar" && item) {
        setFormArticulo({
          ...articuloInicial,
          ...item
        });
      } else {
        setFormArticulo(articuloInicial);
      }
    }

    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setTipoModal('');
    setModoModal('crear');
    setItemSeleccionado(null);
  };

  return {
    modalAbierto,
    tipoModal,
    modoModal,
    itemSeleccionado,
    formHabitacion,
    setFormHabitacion,
    formReservacion,
    setFormReservacion,
    formUsuario,
    setFormUsuario,
    formArticulo,
    setFormArticulo,
    nuevaAmenidad,
    setNuevaAmenidad,
    abrirModal,
    cerrarModal
  };
};