import axios from "axios";

const API_URL = "http://localhost:3000/habitaciones";

export const obtenerHabitaciones = async (filtros = {}) => {
    const response = await axios.get(API_URL, { params: filtros });
    return response.data;
};
