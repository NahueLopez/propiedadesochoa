import { useState } from 'react';
import ConfirmModal from '../components/Categoria/ConfirmModal';
import CategoriaModal from '../components/Categoria/CategoriaModal';

function Categorias() {
  const [categorias, setCategorias] = useState([
    { id: 1, nombre: 'Casa' },
    { id: 2, nombre: 'Departamento' },
    { id: 3, nombre: 'PH' },
    { id: 4, nombre: 'Terreno' },
    { id: 5, nombre: 'Local Comercial' },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
  const [search, setSearch] = useState(''); // Estado para el buscador

  const filteredCategorias = categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCategoria = () => {
    setSelectedCategoria(null);
    setModalOpen(true);
  };

  const handleEdit = (categoria) => {
    setSelectedCategoria(categoria);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setCategoriaToDelete(id);
    setConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    setCategorias(categorias.filter((categoria) => categoria.id !== categoriaToDelete));
    setConfirmModalOpen(false);
    setCategoriaToDelete(null);
  };

  const handleSave = (data) => {
    if (selectedCategoria) {
      setCategorias(
        categorias.map((categoria) =>
          categoria.id === selectedCategoria.id ? { ...categoria, ...data } : categoria
        )
      );
    } else {
      setCategorias([...categorias, { ...data, id: Date.now() }]);
    }
    setModalOpen(false);
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

      {/* Buscador */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla de categorías */}
      {filteredCategorias.length > 0 ? (
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
                  <td className="py-4 px-6 font-medium">{categoria.nombre}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleEdit(categoria)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors duration-150"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(categoria.id)}
                      className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
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