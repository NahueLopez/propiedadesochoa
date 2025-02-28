import { useState } from 'react';
import ConfirmModal from '../components/Inmueble/ConfirmModal';

function Clientes() {
  const [clientes, setClientes] = useState([
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan.perez@email.com',
      telefono: '123-456-7890',
      tipo: 'Propietario',
    },
    {
      id: 2,
      nombre: 'María Gómez',
      email: 'maria.gomez@email.com',
      telefono: '987-654-3210',
      tipo: 'Inquilino',
    },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const [search, setSearch] = useState(''); // Estado para el buscador

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(search.toLowerCase()) ||
    cliente.email.toLowerCase().includes(search.toLowerCase()) ||
    cliente.telefono.toLowerCase().includes(search.toLowerCase()) ||
    cliente.tipo.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCliente = () => {
    setSelectedCliente(null);
    setModalOpen(true);
  };

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setClienteToDelete(id);
    setConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    setClientes(clientes.filter((cliente) => cliente.id !== clienteToDelete));
    setConfirmModalOpen(false);
    setClienteToDelete(null);
  };

  const handleSave = (data) => {
    if (selectedCliente) {
      setClientes(
        clientes.map((cliente) =>
          cliente.id === selectedCliente.id ? { ...cliente, ...data } : cliente
        )
      );
    } else {
      setClientes([...clientes, { ...data, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Clientes</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={handleAddCliente}
        >
          Agregar Cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, email, teléfono o tipo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla de clientes */}
      {filteredClientes.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="py-4 px-6 text-left">Nombre</th>
                <th className="py-4 px-6 text-left">Email</th>
                <th className="py-4 px-6 text-left">Teléfono</th>
                <th className="py-4 px-6 text-left">Tipo</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredClientes.map((cliente, index) => (
                <tr
                  key={cliente.id}
                  className={`border-b ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100 transition-colors duration-150`}
                >
                  <td className="py-4 px-6 font-medium">{cliente.nombre}</td>
                  <td className="py-4 px-6">{cliente.email}</td>
                  <td className="py-4 px-6">{cliente.telefono}</td>
                  <td className="py-4 px-6">{cliente.tipo}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleEdit(cliente)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors duration-150"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cliente.id)}
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
        <p className="text-gray-500 text-center py-6">No hay clientes registrados.</p>
      )}

      {modalOpen && (
        <ClienteModal
          cliente={selectedCliente}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        message="¿Estás seguro de eliminar este cliente?"
      />
    </div>
  );
}

// Modal para agregar/editar clientes
function ClienteModal({ cliente, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo: 'Propietario', // Valor por defecto
  });

  React.useEffect(() => {
    if (cliente) {
      setFormData(cliente);
    }
  }, [cliente]);

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
          {cliente ? 'Editar Cliente' : 'Agregar Cliente'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Propietario">Propietario</option>
              <option value="Inquilino">Inquilino</option>
              <option value="Comprador">Comprador</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Clientes;