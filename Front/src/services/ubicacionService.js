import axios from "axios";

// Usa la URL del .env
const API_BASE_URL = import.meta.env.VITE_URL_BACK;


export const GetUbicacions  = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/ubicaciones_propiedades`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los tipos:", error);
    throw error;
  }
};


