    // src/components/Inmuebles.jsx
    import { useState, useEffect } from 'react';
    import CardList from '../components/Inmueble/CardList';
    import InmuebleModal from '../components/Inmueble/InmuebleModal';
    import ConfirmModal from '../components/Inmueble/ConfirmModal';
    import { getInmuebles, addInmueble, updateInmueble, deleteInmueble } from '../services/InmuebleService'; // Añadir deleteInmueble

    function Inmuebles() {
      const [inmuebles, setInmuebles] = useState([]);
      const [loading, setLoading] = useState(true);
      const [search, setSearch] = useState('');
      const [modalOpen, setModalOpen] = useState(false);
      const [confirmModalOpen, setConfirmModalOpen] = useState(false);
      const [selectedInmueble, setSelectedInmueble] = useState(null);
      const [inmuebleToDelete, setInmuebleToDelete] = useState(null);
      const [error, setError] = useState('');

      useEffect(() => {
        const fetchInmuebles = async () => {
          try {
            setLoading(true);
            const data = await getInmuebles();
            const inmueblesArray = Array.isArray(data) ? data : [data];
            setInmuebles(inmueblesArray);
          } catch (error) {
            setError('Error al cargar los inmuebles. Intenta de nuevo.');
            setInmuebles([]);
          } finally {
            setLoading(false);
          }
        };
        fetchInmuebles();
      }, []);

      const filteredInmuebles = inmuebles.filter((inmueble) => {
        const title = inmueble.title || '';
        const location = inmueble.location || '';
        return (
          title.toLowerCase().includes(search.toLowerCase()) ||
          location.toLowerCase().includes(search.toLowerCase())
        );
      });

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
        setConfirmModalOpen(true);
      };

      const confirmDelete = async () => {
        if (!inmuebleToDelete) return;
    
        try {
          setLoading(true);
          await deleteInmueble(inmuebleToDelete); // Llamada al servicio para eliminar
          setInmuebles(inmuebles.filter((inmueble) => inmueble.id !== inmuebleToDelete)); // Actualizar estado
          setError(''); // Limpiar errores
        } catch (error) {
          setError('Error al eliminar el inmueble. Intenta de nuevo.');
          console.error('Error en confirmDelete:', error.message);
        } finally {
          setLoading(false);
          setConfirmModalOpen(false);
          setInmuebleToDelete(null);
        }
      };

      const handleSave = async (data) => {
        try {
          let response;
          if (selectedInmueble) {
            // Actualizar inmueble existente
            response = await updateInmueble(selectedInmueble.id, data);
            setInmuebles(
              inmuebles.map((inmueble) =>
                inmueble.id === selectedInmueble.id ? { ...inmueble, ...response } : inmueble
              )
            );
          } else {
            // Agregar nuevo inmueble
            response = await addInmueble(data);
            setInmuebles([...inmuebles, { ...response, id: response.id }]);
          }
          setModalOpen(false);
        } catch (error) {
          setError('Error al guardar el inmueble. Intenta de nuevo.');
          console.error('Error en handleSave:', error.response?.data || error.message);
        }
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

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {loading && <p className="text-gray-500 mb-4 text-center">Cargando...</p>}

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