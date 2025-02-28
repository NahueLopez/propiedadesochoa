import { useState } from 'react';
import CardList from '../components/Inmueble/CardList';
import InmuebleModal from '../components/Inmueble/InmuebleModal';
import ConfirmModal from '../components/Inmueble/ConfirmModal';

function Inmuebles() {
  const [inmuebles, setInmuebles] = useState([
    {
      id: 1,
      titulo: 'Casa en el Centro',
      ubicacion: 'Buenos Aires',
      precio: 250000,
      habitaciones: 3,
      banos: 2,
      imagen: 'https://via.placeholder.com/300x200',
    },
    {
      id: 2,
      titulo: 'Departamento Moderno',
      ubicacion: 'Córdoba',
      precio: 120000,
      habitaciones: 2,
      banos: 1,
      imagen: 'https://via.placeholder.com/300x200',
    },
  ]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false); // Estado para ConfirmModal
  const [selectedInmueble, setSelectedInmueble] = useState(null);
  const [inmuebleToDelete, setInmuebleToDelete] = useState(null); // ID del inmueble a eliminar

  const filteredInmuebles = inmuebles.filter((inmueble) =>
    inmueble.titulo.toLowerCase().includes(search.toLowerCase()) ||
    inmueble.ubicacion.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddInmueble = () => {
    setSelectedInmueble(null);
    setModalOpen(true);
  };

  const handleEdit = (inmueble) => {
    setSelectedInmueble(inmueble);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setInmuebleToDelete(id);
    setConfirmModalOpen(true); // Abrimos el ConfirmModal en lugar de window.confirm
  };

  const confirmDelete = () => {
    setInmuebles(inmuebles.filter((inmueble) => inmueble.id !== inmuebleToDelete));
    setConfirmModalOpen(false);
    setInmuebleToDelete(null);
  };

  const handleSave = (data) => {
    if (selectedInmueble) {
      // Editar
      setInmuebles(
        inmuebles.map((inmueble) =>
          inmueble.id === selectedInmueble.id ? { ...inmueble, ...data } : inmueble
        )
      );
    } else {
      // Agregar
      setInmuebles([...inmuebles, { ...data, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestión de Inmuebles</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAddInmueble}
        >
          Agregar Inmueble
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por título o ubicación..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <CardList
        items={filteredInmuebles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <InmuebleModal
          inmueble={selectedInmueble}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        message="¿Estás seguro de eliminar este inmueble?"
      />
    </div>
  );
}

export default Inmuebles;