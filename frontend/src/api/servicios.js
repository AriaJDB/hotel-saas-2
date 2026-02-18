import axios from 'axios';

const API_URL = 'http://localhost:3000';

// --- USUARIOS ---
export const registrarUsuario = (datos) => axios.post(`${API_URL}/usuarios/nuevo`, datos);
export const loginUsuario = (credenciales) => axios.post(`${API_URL}/usuarios/login`, credenciales);

// --- HABITACIONES CON FILTROS ---
export const obtenerHabitaciones = (filtros = {}) => {
    // Los filtros se envían como ?q=valor&tipo=valor...
    return axios.get(`${API_URL}/habitaciones`, { params: filtros });
};
