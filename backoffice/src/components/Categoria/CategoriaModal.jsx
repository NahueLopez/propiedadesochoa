import { useState, useEffect } from 'react';

function CategoriaModal({ categoria, onSave, onClose, loading, serverError }) {
  const [formData, setFormData] = useState({
    name: '', // Cambiado de 'nombre' a 'name'
  });

  useEffect(() => {
    if (categoria) {
      setFormData(categoria);
    }
  }, [categoria]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {categoria && categoria.id ? 'Editar Categoría' : 'Agregar Categoría'}
        </h3>
        {serverError && <p className="text-red-500 mb-4">{serverError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name" // Cambiado de 'nombre' a 'name'
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
              disabled={loading}
            />
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
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoriaModal;  