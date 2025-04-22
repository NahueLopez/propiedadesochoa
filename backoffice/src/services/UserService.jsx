// src/services/UserService.jsx
import axiosInstance from './axios'; // Usamos la instancia con interceptor

// Obtener todos los usuarios
const getUsers = async () => {
  try {
    const response = await axiosInstance.get('/usuarios');
    return response.data.users; // Accedemos a la propiedad 'users'
  } catch (error) {
    console.error('Error al obtener usuarios:', error.response?.data || error.message);
    throw error;
  }
};

// Obtener un usuario específico (opcional, para edición)
const getUser = async (id) => {
  try {
    const response = await axiosInstance.get(`/usuario/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuario:', error.response?.data || error.message);
    throw error;
  }
};

// Agregar un nuevo usuario
const addUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/usuario', userData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar usuario:', error.response?.data || error.message);
    throw error;
  }
};

// Actualizar un usuario existente (usando PATCH)
const updateUser = async (id, userData) => {
  try {
    const response = await axiosInstance.patch(`/usuario/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error.response?.data || error.message);
    throw error;
  }
};

// Eliminar un usuario
const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/usuario/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar usuario:', error.response?.data || error.message);
    throw error;
  }
};

export { getUsers, getUser, addUser, updateUser, deleteUser };