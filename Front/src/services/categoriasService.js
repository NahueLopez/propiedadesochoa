import axios from "axios";

// Usa la URL del .env
const API_BASE_URL = import.meta.env.VITE_URL_BACK;

export const GetCategorias = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categorias_propiedades`);
      return response.data.map((category) => category.name);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      throw error;
    }
  };