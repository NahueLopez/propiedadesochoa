import { useState, useEffect } from 'react';
import UbicacionModal from '../components/Ubicaciones/UbicacionModal';
import ConfirmModal from '../components/Ubicaciones/ConfirmModal';
import { getUbicaciones, addUbicacion, updateUbicacion, deleteUbicacion } from '../services/UbicacionService';

function Ubicaciones() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedUbicacion, setSelectedUbicacion] = useState(null);
  const [ubicacionToDelete, setUbicacionToDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        setLoading(true);
        const data = await getUbicaciones();
        setUbicaciones(data);
      } catch (error) {
        setError('Error al cargar las ubicaciones. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchUbicaciones();
  }, []);

  const filteredUbicaciones = ubicaciones.filter((ubicacion) =>
    ubicacion.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUbicacion = () => {
    setSelectedUbicacion({ id: null, name: '' });
    setModalOpen(true);
  };

  const handleEdit = (ubicacion) => {
    console.log('Ubicación seleccionada para editar:', ubicacion); // Depuración
    setSelectedUbicacion({ ...ubicacion });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setUbicacionToDelete(id);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteUbicacion(ubicacionToDelete);
      setUbicaciones(ubicaciones.filter((ubicacion) => ubicacion.id !== ubicacionToDelete));
      setConfirmModalOpen(false);
      setUbicacionToDelete(null);
    } catch (error) {
      setError('Error al eliminar la ubicación. Intenta de nuevo.');
      console.error('Error en confirmDelete:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      setLoading(true);
      if (selectedUbicacion && selectedUbicacion.id) {
        const updatedUbicacion = await updateUbicacion(selectedUbicacion.id, data);
        setUbicaciones(
          ubicaciones.map((ubicacion) =>
            ubicacion.id === selectedUbicacion.id ? updatedUbicacion : ubicacion
          )
        );
      } else {
        const response = await addUbicacion(data);
        let newUbicacion = response;
        setUbicaciones((prevUbicaciones) => {
          const updatedUbicaciones = [...prevUbicaciones, newUbicacion];
          return updatedUbicaciones;
        });
      }
      setModalOpen(false);
      setError('');
    } catch (error) {
      const serverError = error.response?.data?.message || error.response?.data?.error || error.message || 'Error desconocido al guardar la ubicación.';
      setError(serverError);
      console.error('Error en handleSave:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Ubicaciones</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={handleAddUbicacion}
        >
          Agregar Ubicación
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4 text-center">Cargando...</p>}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? null : filteredUbicaciones.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="py-4 px-6 text-left">Nombre</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredUbicaciones.map((ubicacion, index) => (
                <tr
                  key={ubicacion.id}
                  className={`border-b ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100 transition-colors duration-150`}
                >
                  <td className="py-4 px-6 font-medium">{ubicacion.name}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleEdit(ubicacion)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors duration-150"
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(ubicacion.id)}
                      className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-6">No hay ubicaciones registradas.</p>
      )}

      {modalOpen && (
        <UbicacionModal
          ubicacion={selectedUbicacion}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
          loading={loading}
          serverError={error}
        />
      )}

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        message="¿Estás seguro de eliminar esta ubicación?"
      />
    </div>
  );
}

export default Ubicaciones;