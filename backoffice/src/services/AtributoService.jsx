import axiosInstance from './axios';

const getAtributos = async () => {
  try {
    const response = await axiosInstance.get('/atributos');
    return response.data.atributos || response.data; // Maneja ambos casos: { atributos: [...] } o [...]
  } catch (error) {
    console.error('Error al obtener atributos:', error.response?.data || error.message);
    throw error;
  }
};

const getAtributo = async (id) => {
  try {
    const response = await axiosInstance.get(`/atributo/${id}`);
    return response.data.atributo || response.data; // Maneja { atributo: {...} } o {...}
  } catch (error) {
    console.error('Error al obtener atributo:', error.response?.data || error.message);
    throw error;
  }
};

const addAtributo = async (atributoData) => {
  try {
    const response = await axiosInstance.post('/atributo', atributoData);
    return response.data.atributo || response.data; // Maneja { atributo: {...} } o {...}
  } catch (error) {
    console.error('Error al agregar atributo:', error.response?.data || error.message);
    throw error;
  }
};

const updateAtributo = async (id, atributoData) => {
  try {
    const response = await axiosInstance.patch(`/atributo/${id}`, atributoData);
    return response.data.atributo || response.data; // Maneja { atributo: {...} } o {...}
  } catch (error) {
    throw error;
  }
};

const deleteAtributo = async (id) => {
  try {
    const response = await axiosInstance.delete(`/atributo/${id}`);
    return response.data; // Podría devolver { message: 'Atributo eliminado' }
  } catch (error) {
    console.error('Error al eliminar atributo:', error.response?.data || error.message);
    throw error;
  }
};

export { getAtributos, getAtributo, addAtributo, updateAtributo, deleteAtributo };