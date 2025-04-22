// src/services/CategoriaService.jsx
import axiosInstance from './axios';

const getCategorias = async () => {
  try {
    const response = await axiosInstance.get('/categorias');
    return response.data; // El backend devuelve directamente un arreglo [{...}, {...}]
  } catch (error) {
    console.error('Error al obtener categorías:', error.response?.data || error.message);
    throw error;
  }
};

const getCategoria = async (id) => {
  try {
    const response = await axiosInstance.get(`/categoria/${id}`);
    return response.data; // Ajustaremos según el formato real del backend
  } catch (error) {
    console.error('Error al obtener categoría:', error.response?.data || error.message);
    throw error;
  }
};

const addCategoria = async (categoriaData) => {
  try {
    const response = await axiosInstance.post('/categoria', categoriaData);
    return response.data; // Ajustaremos según el formato real
  } catch (error) {
    console.error('Error al agregar categoría:', error.response?.data || error.message);
    throw error;
  }
};

const updateCategoria = async (id, categoriaData) => {
  try {
    const response = await axiosInstance.patch(`/categoria/${id}`, categoriaData);
    return response.data; // Ajustaremos según el formato real
  } catch (error) {
    console.error('Error al actualizar categoría:', error.response?.data || error.message);
    throw error;
  }
};

const deleteCategoria = async (id) => {
  try {
    const response = await axiosInstance.delete(`/categoria/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar categoría:', error.response?.data || error.message);
    throw error;
  }
};

export { getCategorias, getCategoria, addCategoria, updateCategoria, deleteCategoria };