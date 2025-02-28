import { useState } from 'react';
import AtributoModal from '../components/Atributos/AtributoModal';
import ConfirmModal from '../components/Atributos/ConfirmModal';

function Atributos() {
  const [atributos, setAtributos] = useState([
    { id: 1, nombre: 'Piscina' },
    { id: 2, nombre: 'Garage' },
    { id: 3, nombre: 'Balcón' },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedAtributo, setSelectedAtributo] = useState(null);
  const [atributoToDelete, setAtributoToDelete] = useState(null);
  const [search, setSearch] = useState(''); // Estado para el buscador

  const filteredAtributos = atributos.filter((atributo) =>
    atributo.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddAtributo = () => {
    setSelectedAtributo(null);
    setModalOpen(true);
  };

  const handleEdit = (atributo) => {
    setSelectedAtributo(atributo);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setAtributoToDelete(id);
    setConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    setAtributos(atributos.filter((atributo) => atributo.id !== atributoToDelete));
    setConfirmModalOpen(false);
    setAtributoToDelete(null);
  };

  const handleSave = (data) => {
    if (selectedAtributo) {
      setAtributos(
        atributos.map((atributo) =>
          atributo.id === selectedAtributo.id ? { ...atributo, ...data } : atributo
        )
      );
    } else {
      setAtributos([...atributos, { ...data, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Atributos</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={handleAddAtributo}
        >
          Agregar Atributo
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

      {/* Tabla mejorada */}
      {filteredAtributos.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="py-4 px-6 text-left">Nombre</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredAtributos.map((atributo, index) => (
                <tr
                  key={atributo.id}
                  className={`border-b ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100 transition-colors duration-150`}
                >
                  <td className="py-4 px-6 font-medium">{atributo.nombre}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleEdit(atributo)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors duration-150"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(atributo.id)}
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
        <p className="text-gray-500 text-center py-6">No hay atributos registrados.</p>
      )}

      {modalOpen && (
        <AtributoModal
          atributo={selectedAtributo}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        message="¿Estás seguro de eliminar este atributo?"
      />
    </div>
  );
}

export default Atributos;