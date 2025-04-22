import { useState, useEffect } from 'react';
import TipoModal from '../components/Tipos/TipoModal';
import ConfirmModal from '../components/Tipos/ConfirmModal';
import { getTipos, addTipo, updateTipo, deleteTipo } from '../services/TipoService';

function Tipos() {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [tipoToDelete, setTipoToDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        setLoading(true);
        const data = await getTipos();
        setTipos(data);
      } catch (error) {
        setError('Error al cargar los tipos. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchTipos();
  }, []);

  const filteredTipos = tipos.filter((tipo) =>
    tipo.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddTipo = () => {
    setSelectedTipo({ id: null, name: '', descripcion: '' });
    setModalOpen(true);
  };

  const handleEdit = (tipo) => {
    console.log('Tipo seleccionado para editar:', tipo);
    setSelectedTipo({ ...tipo });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setTipoToDelete(id);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteTipo(tipoToDelete);
      setTipos(tipos.filter((tipo) => tipo.id !== tipoToDelete));
      setConfirmModalOpen(false);
      setTipoToDelete(null);
    } catch (error) {
      setError('Error al eliminar el tipo. Intenta de nuevo.');
      console.error('Error en confirmDelete:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      setLoading(true);
      if (selectedTipo && selectedTipo.id) {
        const updatedTipo = await updateTipo(selectedTipo.id, data);
        setTipos(
          tipos.map((tipo) =>
            tipo.id === selectedTipo.id ? updatedTipo : tipo
          )
        );
      } else {
        const response = await addTipo(data);
        let newTipo = response;
        setTipos((prevTipos) => {
          const updatedTipos = [...prevTipos, newTipo];
          return updatedTipos;
        });
      }
      setModalOpen(false);
      setError('');
    } catch (error) {
      const serverError = error.response?.data?.message || error.response?.data?.error || error.message || 'Error desconocido al guardar el tipo.';
      setError(serverError);
      console.error('Error en handleSave:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Tipos</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={handleAddTipo}
        >
          Agregar Tipo
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

      {loading ? null : filteredTipos.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="py-4 px-6 text-left">Nombre</th>
                <th className="py-4 px-6 text-left">Descripción</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredTipos.map((tipo, index) => (
                <tr
                  key={tipo.id}
                  className={`border-b ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100 transition-colors duration-150`}
                >
                  <td className="py-4 px-6 font-medium">{tipo.name}</td>
                  <td className="py-4 px-6">{tipo.descripcion || 'Sin descripción'}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleEdit(tipo)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors duration-150"
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(tipo.id)}
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
        <p className="text-gray-500 text-center py-6">No hay tipos registrados.</p>
      )}

      {modalOpen && (
        <TipoModal
          tipo={selectedTipo}
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
        message="¿Estás seguro de eliminar este tipo?"
      />
    </div>
  );
}

export default Tipos;