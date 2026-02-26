import axios from "axios";

const API_URL = "http://localhost:3000/habitaciones";

export const obtenerHabitaciones = async (filtros = {}) => {
    const { data } = await axios.get(API_URL, { params: filtros });
    return data;
};

export const crearHabitacion = async (datos) => {
    const { data } = await axios.post(`${API_URL}/nueva`, datos);
    return data;
};

export const actualizarHabitacion = async (id, datos) => {
    const { data } = await axios.put(`${API_URL}/modificarHabitacion/${id}`, datos);
    return data;
};

export const eliminarHabitacion = async (id) => {
    const { data } = await axios.delete(`${API_URL}/eliminarHabitacionBD/${id}`);
    return data;
};