import axiosInstance from './axios';

const getUbicaciones = async () => {
  try {
    const response = await axiosInstance.get('/ubicaciones');
    return response.data.ubicaciones || response.data; 
  } catch (error) {
    console.error('Error al obtener las ubicaciones:', error.response?.data || error.message);
    throw error;
  }
};

const getUbicacion = async (id) => {
  try {
    const response = await axiosInstance.get(`/ubicacion/${id}`);
    return response.data.ubicacion || response.data; 
  } catch (error) {
    console.error('Error al obtener la ubicacion:', error.response?.data || error.message);
    throw error;
  }
};

const addUbicacion = async (ubicacionData) => {
  try {
    const response = await axiosInstance.post('/ubicacion', ubicacionData);
    return response.data.ubicacion || response.data; 
  } catch (error) {
    console.error('Error al agregar ubicacion:', error.response?.data || error.message);
    throw error;
  }
};

const updateUbicacion = async (id, ubicacionData) => {
  try {
    const response = await axiosInstance.patch(`/ubicacion/${id}`, ubicacionData);
    return response.data.ubicacion || response.data; 
  } catch (error) {
    throw error;
  }
};

const deleteUbicacion = async (id) => {
  try {
    const response = await axiosInstance.delete(`/ubicacion/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Error al eliminar ubicacion:', error.response?.data || error.message);
    throw error;
  }
};

export { getUbicaciones, getUbicacion, addUbicacion, updateUbicacion, deleteUbicacion };