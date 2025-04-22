import { useState, useEffect } from 'react';

function ClienteModal({ cliente, onSave, onClose, loading, serverError }) {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    phone: '',
    type: 'dueño',
  });
  const [error, setError] = useState(''); // Estado para errores locales

  useEffect(() => {
    if (cliente) {
      setFormData({
        name: cliente.name || '',
        lastname: cliente.lastname || '',
        phone: cliente.phone || '',
        type: cliente.type || 'dueño',
      });
      setError(''); // Reseteamos el error local al editar
    } else {
      setFormData({ name: '', lastname: '', phone: '', type: 'dueño' });
      setError(''); // Reseteamos el error local al agregar
    }
  }, [cliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiamos el error local al cambiar el campo
    if (name === 'phone' && error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación básica
    if (!formData.name || !formData.lastname || !formData.phone) {
      setError('Por favor, completa todos los campos requeridos.');
      return;
    }
    // Validación específica para phone como string
    const cleanedPhone = formData.phone.replace(/\D/g, ''); // Elimina caracteres no numéricos
    if (cleanedPhone.length < 6 || cleanedPhone.length > 12) {
      setError('El número de teléfono debe tener entre 6 y 12 dígitos.');
      return;
    }
    // Si todo está bien, enviamos los datos con phone como string
    onSave(formData); // Enviamos el phone original como string
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {loading && (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <p className="text-white text-lg">Cargando...</p>
          </div>
        )}
        <h3 className="text-lg font-semibold mb-4">
          {cliente && cliente.id ? 'Editar Cliente' : 'Agregar Cliente'}
        </h3>
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Error de validación local */}
        {serverError && !error && <p className="text-red-500 mb-4">{serverError}</p>} {/* Error del backend */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Apellido</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="dueño">Dueño</option>
              <option value="inquilino">Inquilino</option>
              <option value="comprador">Comprador</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClienteModal;