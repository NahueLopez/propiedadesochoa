import axiosInstance from './axios'; // Usamos la instancia con interceptor

// Obtener todos los clientes
const getCustomers = async () => {
  try {
    const response = await axiosInstance.get('/clientes');
    return response.data; // Asegúrate de que el backend devuelva un array en data
  } catch (error) {
    console.error('Error al obtener clientes:', error.response?.data || error.message);
    throw error;
  }
};

// Obtener un cliente específico (opcional, para edición)
const getCustomer = async (id) => {
  try {
    const response = await axiosInstance.get(`/cliente/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener cliente:', error.response?.data || error.message);
    throw error;
  }
};

// Agregar un nuevo cliente
const addCustomer = async (customerData) => {
  try {
    const response = await axiosInstance.post('/cliente', customerData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar cliente:', error.response?.data || error.message);
    throw error;
  }
};

// Actualizar un cliente existente (usando PATCH)
const updateCustomer = async (id, customerData) => {
  try {
    const response = await axiosInstance.patch(`/cliente/${id}`, customerData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar cliente:', error.response?.data || error.message);
    throw error;
  }
};

// Eliminar un cliente
const deleteCustomer = async (id) => {
  try {
    const response = await axiosInstance.delete(`/cliente/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar cliente:', error.response?.data || error.message);
    throw error;
  }
};

export { getCustomers, getCustomer, addCustomer, updateCustomer, deleteCustomer };