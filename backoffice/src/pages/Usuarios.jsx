// src/pages/Usuarios.jsx
import { useState, useEffect } from 'react';
import ConfirmModal from '../components/Inmueble/ConfirmModal';
import UsuarioCrearModal from '../components/Usuarios/UsuarioCrearModal';
import UsuarioEditarModal from '../components/Usuarios/UsuarioEditarModal';
import { getUsers, addUser, updateUser, deleteUser } from '../services/UserService';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [crearModalOpen, setCrearModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsuarios(data);
      } catch (error) {
        setError('Error al cargar los usuarios. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setCrearModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser({ ...user });
    setEditarModalOpen(true);
  };

  const handleDelete = (id) => {
    setUserToDelete(id);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteUser(userToDelete);
      setUsuarios(usuarios.filter((user) => user.id !== userToDelete));
      setConfirmModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      setError('Error al eliminar el usuario. Intenta de nuevo.');
      console.error('Error en confirmDelete:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearSave = async (data) => {
    try {
      setLoading(true);
      const response = await addUser(data);

      // Verificamos si el backend devuelve el usuario creado en una propiedad 'user'
      let newUser;
      if (response.user) {
        newUser = response.user; // Si el backend envuelve el usuario en { user: ... }
      } else {
        newUser = response; // Si devuelve el usuario directamente
      }

      // Agregamos el nuevo usuario al estado
      setUsuarios((prevUsuarios) => {
        const updatedUsuarios = [...prevUsuarios, newUser];
        return updatedUsuarios;
      });

      // Verificamos si el usuario se agregó correctamente al estado
      if (!usuarios.some((u) => u.id === newUser.id)) {
        const refreshedUsers = await getUsers();
        setUsuarios(refreshedUsers);
      }

      setCrearModalOpen(false);
      setError('');
    } catch (error) {
      const serverError = error.response?.data?.message || error.response?.data?.error || error.message || 'Error desconocido al guardar el usuario.';
      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarSave = async (data) => {
    try {
      setLoading(true);
      const response = await updateUser(selectedUser.id, data);

      let updatedUser;
      if (response.user) {
        updatedUser = response.user;
      } else {
        updatedUser = response;
      }

      setUsuarios((prevUsuarios) => {
        const updatedUsuarios = prevUsuarios.map((user) =>
          user.id === selectedUser.id ? { ...updatedUser } : user
        );
        return updatedUsuarios;
      });

      setEditarModalOpen(false);
      setSelectedUser(null);
      setError('');
    } catch (error) {
      const serverError = error.response?.data?.message || error.response?.data?.error || error.message || 'Error desconocido al guardar el usuario.';
      setError(serverError);
      console.error('Error completo en handleEditarSave:', error);
      console.error('Respuesta del servidor:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Usuarios</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={handleAddUser}
        >
          Agregar Usuario
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4 text-center">Cargando...</p>}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={true}
        />
      </div>
      {loading ? null : usuarios.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="py-4 px-6 text-left">ID</th>
                <th className="py-4 px-6 text-left">Nombre</th>
                <th className="py-4 px-6 text-left">Email</th>
                <th className="py-4 px-6 text-left">Verificado</th>
                <th className="py-4 px-6 text-left">Creado</th>
                <th className="py-4 px-6 text-left">Actualizado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {usuarios.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-150`}
                >
                  <td className="py-4 px-6 font-medium">{user.id}</td>
                  <td className="py-4 px-6">{user.name || 'Sin nombre'}</td>
                  <td className="py-4 px-6">{user.email || 'Sin email'}</td>
                  <td className="py-4 px-6">{user.email_verified_at ? 'Sí' : 'No'}</td>
                  <td className="py-4 px-6">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="py-4 px-6">{new Date(user.updated_at).toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors duration-150"
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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
        <p className="text-gray-500 text-center py-6">No hay usuarios registrados.</p>
      )}
      {crearModalOpen && (
        <UsuarioCrearModal
          onSave={handleCrearSave}
          onClose={() => setCrearModalOpen(false)}
          loading={loading}
          serverError={error}
        />
      )}
      {editarModalOpen && (
        <UsuarioEditarModal
          user={selectedUser}
          onSave={handleEditarSave}
          onClose={() => {
            setEditarModalOpen(false);
            setSelectedUser(null);
          }}
          loading={loading}
          serverError={error}
        />
      )}
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        message="¿Estás seguro de eliminar este usuario?"
      />
    </div>
  );
}

export default Usuarios;