import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_URL_BACK;

export const GetPropiedades = async (filters = {}) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/propiedades`, {
            params: filters // Pasa los filtros como parámetros de consulta
        });
        return response.data; // Devuelve el arreglo de propiedades
    } catch (error) {
        console.error("Error al obtener las propiedades:", error.response?.data || error.message);
        throw error; // Lanza el error para manejarlo en el componente
    }
};

export const GetLatestPropiedades = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/ultimas_propiedades`);
        return response.data; // Devuelve el arreglo de las últimas 10 propiedades
    } catch (error) {
        console.error("Error al obtener las últimas propiedades:", error.response?.data || error.message);
        throw error; // Lanza el error para manejarlo en el componente
    }
};


export const getPropiedad = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/propiedad/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener inmueble:', error.response?.data || error.message);
      throw error;
    }
  };