import axios from 'axios';

const API_URL = 'http://localhost:3000/usuarios';

// --- USUARIOS ---
export const registrarUsuario = (datos) => 
    axios.post(`${API_URL}/nuevo`, datos);

export const loginUsuario = (credenciales) => 
    axios.post(`${API_URL}/login`, credenciales);

export const obtenerUsuarios = async () => {
    const { data } = await axios.get(API_URL);
    return data;
};

export const crearUsuario = async (datos) => {
    const { data } = await axios.post(API_URL, datos);
    return data;
};

export const actualizarUsuario = async (id, datos) => {
    const { data } = await axios.put(`${API_URL}/${id}`, datos);
    return data;
};

export const eliminarUsuario = async (id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
};
