import axiosInstance from './axios';

const getTipos = async () => {
  try {
    const response = await axiosInstance.get('/tipos');
    return response.data; // El backend devuelve directamente un arreglo [{...}, {...}]
  } catch (error) {
    console.error('Error al obtener categorías:', error.response?.data || error.message);
    throw error;
  }
};

const getTipo = async (id) => {
  try {
    const response = await axiosInstance.get(`/tipos/${id}`);
    return response.data; // Ajustaremos según el formato real del backend
  } catch (error) {
    console.error('Error al obtener categoría:', error.response?.data || error.message);
    throw error;
  }
};

const addTipo = async (tipoData) => {
  try {
    const response = await axiosInstance.post('/tipos', tipoData);
    return response.data; // Ajustaremos según el formato real
  } catch (error) {
    console.error('Error al agregar tipo:', error.response?.data || error.message);
    throw error;
  }
};

const updateTipo = async (id, tipoData) => {
  try {
    const response = await axiosInstance.patch(`/tipos/${id}`, tipoData);
    return response.data; // Ajustaremos según el formato real
  } catch (error) {
    console.error('Error al actualizar categoría:', error.response?.data || error.message);
    throw error;
  }
};

const deleteTipo = async (id) => {
  try {
    const response = await axiosInstance.delete(`/tipos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar categoría:', error.response?.data || error.message);
    throw error;
  }
};

export { getTipos, getTipo, addTipo, updateTipo, deleteTipo };