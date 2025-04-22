import { useState, useEffect } from 'react';
import ConfirmModal from '../components/Inmueble/ConfirmModal';
import ClienteModal from '../components/Clientes/ClienteModal';
import { getCustomers, getCustomer, addCustomer, updateCustomer, deleteCustomer } from '../services/CustomerService';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(''); // Error genérico para la interfaz

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getCustomers();
        setClientes(data);
      } catch (error) {
        setError('Error al cargar los clientes. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Solo cargar datos del cliente si tiene un ID válido (no null)
  useEffect(() => {
    if (selectedCliente && selectedCliente.id) {
      const fetchCustomerData = async () => {
        try {
          setLoading(true);
          const data = await getCustomer(selectedCliente.id);
          setSelectedCliente(data);
        } catch (error) {
          setError('Error al cargar los datos del cliente.');
        } finally {
          setLoading(false);
        }
      };
      fetchCustomerData();
    }
  }, [selectedCliente]);

  const handleAddCliente = () => {
    setSelectedCliente({ id: null, name: '', lastname: '', phone: '', type: 'dueño' });
    setModalOpen(true);
  };

  const handleEdit = (cliente) => {
    setSelectedCliente({ ...cliente });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setClienteToDelete(id);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteCustomer(clienteToDelete);
      setClientes(clientes.filter((cliente) => cliente.id !== clienteToDelete));
      setConfirmModalOpen(false);
      setClienteToDelete(null);
    } catch (error) {
      setError('Error al eliminar el cliente. Intenta de nuevo.');
      console.error('Error en confirmDelete:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      setLoading(true);
      if (selectedCliente && selectedCliente.id) {
        const updatedCliente = await updateCustomer(selectedCliente.id, data);
        setClientes(
          clientes.map((cliente) =>
            cliente.id === selectedCliente.id ? updatedCliente : cliente
          )
        );
      } else {
        const response = await addCustomer(data);

        let newCliente;
        if (response.customer) {
          newCliente = response.customer; // Si el backend envuelve el cliente en { customer: ... }
        } else {
          newCliente = response; // Si devuelve el cliente directamente
        }

        // Actualizamos el estado dentro del callback
        setClientes((prevClientes) => {
          const updatedClientes = [...prevClientes, newCliente];
          return updatedClientes;
        });

        // Verificación dentro del mismo scope (opcional, pero mantenemos como fallback)
        setClientes((prevClientes) => {
          if (!prevClientes.some((c) => c.id === newCliente.id)) {
            return [...prevClientes, newCliente]; // Intentamos forzar la adición
          }
          return prevClientes;
        });
      }
      setModalOpen(false);
      setError('');
    } catch (error) {
      const serverError = error.response?.data?.message || error.response?.data?.error || error.message || 'Error desconocido al guardar el cliente.';
      setError(serverError); // Pasamos el error específico al estado
      console.error('Error en handleSave:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
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
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Mostramos el error genérico aquí */}
      {loading && <p className="text-gray-500 mb-4 text-center">Cargando...</p>}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, email, teléfono o tipo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={true}
        />
      </div>
      {loading ? null : clientes.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="py-4 px-6 text-left">ID</th>
                <th className="py-4 px-6 text-left">Nombre</th>
                <th className="py-4 px-6 text-left">Apellido</th>
                <th className="py-4 px-6 text-left">Teléfono</th>
                <th className="py-4 px-6 text-left">Tipo</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {clientes.map((cliente, index) => (
                <tr
                  key={cliente.id}
                  className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-150`}
                >
                  <td className="py-4 px-6 font-medium">{cliente.id}</td>
                  <td className="py-4 px-6">{cliente.name || 'Sin nombre'}</td>
                  <td className="py-4 px-6">{cliente.lastname || 'Sin apellido'}</td>
                  <td className="py-4 px-6">{cliente.phone || 'Sin teléfono'}</td>
                  <td className="py-4 px-6">{cliente.type || 'Sin tipo'}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleEdit(cliente)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors duration-150"
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cliente.id)}
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
        <p className="text-gray-500 text-center py-6">No hay clientes registrados.</p>
      )}
      {modalOpen && (
        <ClienteModal
          cliente={selectedCliente}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
          loading={loading}
          serverError={error} // Pasamos el error del backend al modal
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

export default Clientes;