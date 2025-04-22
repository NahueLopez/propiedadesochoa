// src/services/InmuebleService.jsx
import axiosInstance from './axios';

const getInmuebles = async () => {
  try {
    const response = await axiosInstance.get('/propiedades');
    return response.data; // Devuelve directamente el arreglo de inmuebles
  } catch (error) {
    console.error('Error al obtener inmuebles:', error.response?.data || error.message);
    throw error;
  }
};

const getInmueble = async (id) => {
  try {
    const response = await axiosInstance.get(`/propiedad/${id}`);
    console.log('InmuebleService - getInmueble:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener inmueble:', error.response?.data || error.message);
    throw error;
  }
};

const addInmueble = async (inmuebleData) => {
  try {
    const response = await axiosInstance.post('/propiedad', inmuebleData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar inmueble:', error.response?.data || error.message);
    throw error;
  }
};

const updateInmueble = async (id, data) => { 
  try {
    console.log('Datos enviados:', Object.fromEntries(data));
    console.log('ID enviado al backend:', id); // Agrega esto

    const response = await axiosInstance.post(`/propiedad/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar inmueble:', {
      status: error.response?.status,
      data: error.response?.data, 
      message: error.message,
    });
    throw error;
  }
};

const deleteInmueble = async (id) => {
  try {
    const response = await axiosInstance.delete(`/propiedad/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar inmueble:', error.response?.data || error.message);
    throw error;
  }
};

export { getInmuebles, getInmueble, addInmueble, updateInmueble, deleteInmueble };