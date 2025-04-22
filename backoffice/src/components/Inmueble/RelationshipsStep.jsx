    // src/components/inmueble-modal-steps/RelationshipsStep.jsx
    import { useState } from 'react';
    import PropTypes from 'prop-types';

    function RelationshipsStep({ formData, handleChange, clientes }) {
    const [searchOwner, setSearchOwner] = useState(''); // Estado para el buscador de dueños
    const [searchTenant, setSearchTenant] = useState(''); // Estado para el buscador de inquilinos

    // Filtrar clientes según el término de búsqueda
    const filteredOwners = clientes.filter((cliente) =>
        (cliente.name || `Cliente ${cliente.id}`).toLowerCase().includes(searchOwner.toLowerCase())
    );
    const filteredTenants = clientes.filter((cliente) =>
        (cliente.name || `Cliente ${cliente.id}`).toLowerCase().includes(searchTenant.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dueños (Opcional)</label>
            <input
                type="text"
                placeholder="Buscar dueño..."
                value={searchOwner}
                onChange={(e) => setSearchOwner(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <select
                name="owners"
                multiple
                value={formData.owners}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-48"
            >
                {filteredOwners.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                    {cliente.name || `Cliente ${cliente.id}`}
                </option>
                ))}
            </select>
            <p className="text-sm text-gray-600 mt-1">Mantén Ctrl (o Cmd) para seleccionar múltiples.</p>
            </div>
        </div>
        <div className="space-y-6">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inquilinos (Opcional)</label>
            <input
                type="text"
                placeholder="Buscar inquilino..."
                value={searchTenant}
                onChange={(e) => setSearchTenant(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <select
                name="tenants"
                multiple
                value={formData.tenants}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-48"
            >
                {filteredTenants.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                    {cliente.name || `Cliente ${cliente.id}`}
                </option>
                ))}
            </select>
            <p className="text-sm text-gray-600 mt-1">Mantén Ctrl (o Cmd) para seleccionar múltiples.</p>
            </div>
        </div>
        </div>
    );
    }

    RelationshipsStep.propTypes = {
    formData: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    clientes: PropTypes.array.isRequired,
    };

    export default RelationshipsStep;