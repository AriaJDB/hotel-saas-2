import axios from 'axios';

const API_URL = 'http://localhost:3000/usuarios';

export const registrarUsuario = (datos) => axios.post(`${API_URL}/nuevo`, datos);
export const loginUsuario = (credenciales) => axios.post(`${API_URL}/login`, credenciales);