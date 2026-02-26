import axios from "axios";

const API_URL = "http://localhost:3000/articulos";

export const obtenerArticulos = async () => {
    const { data } = await axios.get(API_URL);
    return data;
};

export const crearArticulo = async (datos) => {
    const { data } = await axios.post(API_URL, datos);
    return data;
};

export const actualizarArticulo = async (id, datos) => {
    const { data } = await axios.put(`${API_URL}/${id}`, datos);
    return data;
};

export const eliminarArticulo = async (id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
};