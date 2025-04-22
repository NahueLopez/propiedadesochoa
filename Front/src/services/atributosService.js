import axios from "axios";

// Usa la URL del .env
const API_BASE_URL = import.meta.env.VITE_URL_BACK;

export const GetAtributos = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/atributos_propiedades`);
        return response.data.map((attribute) => attribute.name);
      } catch (error) {
        console.error("Error al obtener atributos:", error);
        throw error;
      }   
};


