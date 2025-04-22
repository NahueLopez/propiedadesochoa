import { useState, useEffect } from 'react';
import CategoriaModal from '../components/Categoria/CategoriaModal';
import ConfirmModal from '../components/Categoria/ConfirmModal';
import { getCategorias, addCategoria, updateCategoria, deleteCategoria } from '../services/CategoriaService';


function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const data = await getCategorias();
        setCategorias(data);
      } catch (error) {
        setError('Error al cargar las categorías. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  const filteredCategorias = categorias.filter((categoria) =>
    categoria.name.toLowerCase().includes(search.toLowerCase()) // Cambiado a 'name' por el backend
  );

  const handleAddCategoria = () => {
    setSelectedCategoria({ id: null, name: '' });
    setModalOpen(true);
  };

  const handleEdit = (categoria) => {
    setSelectedCategoria({ ...categoria });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setCategoriaToDelete(id);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteCategoria(categoriaToDelete);
      setCategorias(categorias.filter((categoria) => categoria.id !== categoriaToDelete));
      setConfirmModalOpen(false);
      setCategoriaToDelete(null);
    } catch (error) {
      setError('Error al eliminar la categoría. Intenta de nuevo.');
      console.error('Error en confirmDelete:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      setLoading(true);
      if (selectedCategoria && selectedCategoria.id) {
        const updatedCategoria = await updateCategoria(selectedCategoria.id, data);
        setCategorias(
          categorias.map((categoria) =>
            categoria.id === selectedCategoria.id ? updatedCategoria : categoria
          )
        );
      } else {
        const response = await addCategoria(data);

        let newCategoria = response; // Asumimos que el backend devuelve la categoría directamente
        setCategorias((prevCategorias) => {
          const updatedCategorias = [...prevCategorias, newCategoria];
          return updatedCategorias;
        });
      }
      setModalOpen(false);
      setError('');
    } catch (error) {
      const serverError = error.response?.data?.message || error.response?.data?.error || error.message || 'Error desconocido al guardar la categoría.';
      setError(serverError);
      console.error('Error en handleSave:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Categorías</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={handleAddCategoria}
        >
          Agregar Categoría
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

      {loading ? null : filteredCategorias.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="py-4 px-6 text-left">Nombre</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredCategorias.map((categoria, index) => (
                <tr
                  key={categoria.id}
                  className={`border-b ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100 transition-colors duration-150`}
                >
                  <td className="py-4 px-6 font-medium">{categoria.name}</td> {/* Cambiado a 'name' */}
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleEdit(categoria)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors duration-150"
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(categoria.id)}
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
        <p className="text-gray-500 text-center py-6">No hay categorías registradas.</p>
      )}

      {modalOpen && (
        <CategoriaModal
          categoria={selectedCategoria}
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
        message="¿Estás seguro de eliminar esta categoría?"
      />
    </div>
  );
}

export default Categorias;