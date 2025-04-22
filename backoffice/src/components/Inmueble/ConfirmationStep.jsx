// src/components/ConfirmationStep.jsx
import React from 'react';
import PropTypes from 'prop-types';

function ConfirmationStep({
  formData = {},
  categorias = [],
  clientes = [],
  atributos = [],
  previewImage = '',
  secondaryPreviews = [],
}) {
  // Funciones para obtener nombres
  const getCategoryName = (categoryId) =>
    categorias.find((cat) => cat?.id === Number(categoryId))?.name || 'Sin categoría';

  const getAttributeName = (attributeId) =>
    atributos.find((attr) => attr?.id === Number(attributeId))?.name || 'Desconocido';

  const getCustomerName = (customerId) =>
    clientes.find((cli) => cli?.id === Number(customerId))?.name || 'Desconocido';

  // Asegurarse de que owners y tenants sean arrays
  const owners = Array.isArray(formData.owners) ? formData.owners : [];
  const tenants = Array.isArray(formData.tenants) ? formData.tenants : [];
  const atributosValues = formData.atributos || {};


  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Resumen del Inmueble</h4>

      {/* Información básica */}
      <div>
        <p><strong>Título:</strong> {formData.title || 'No especificado'}</p>
        <p><strong>Dirección:</strong> {formData.address || 'No especificado'}</p>
        <p><strong>Precio:</strong> ${formData.price || '0'}</p>
        <p><strong>Ubicación:</strong> {formData.location || 'No especificado'}</p>
        <p><strong>Estado:</strong> {formData.status || 'No especificado'}</p>
        <p><strong>Categoría:</strong> {getCategoryName(formData.category_id)}</p>
      </div>

      {/* Imágenes */}
      <div>
        <h5 className="text-md font-medium">Imágenes</h5>
        {previewImage ? (
          <img src={previewImage} alt="Imagen principal" className="w-32 h-32 object-cover" />
        ) : (
          <p>No hay imagen principal.</p>
        )}
        <div className="flex space-x-2 mt-2">
          {Array.isArray(secondaryPreviews) && secondaryPreviews.length > 0 ? (
            secondaryPreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Imagen secundaria ${index + 1}`}
                className="w-24 h-24 object-cover"
              />
            ))
          ) : (
            <p>No hay imágenes secundarias.</p>
          )}
        </div>
      </div>

      {/* Atributos */}
      <div>
        <h5 className="text-md font-medium">Atributos</h5>
        {atributosValues && Object.keys(atributosValues).length > 0 ? (
          Object.entries(atributosValues).map(([id, value]) => (
            <p key={id}>
              <strong>{getAttributeName(id)}:</strong> {value}
            </p>
          ))
        ) : (
          <p>No hay atributos seleccionados.</p>
        )}
      </div>

      {/* Relaciones */}
      <div>
        <h5 className="text-md font-medium">Dueños</h5>
        {owners.length > 0 ? (
          owners.map((ownerId) => (
            <p key={ownerId}>{getCustomerName(ownerId)}</p>
          ))
        ) : (
          <p>No hay dueños asignados.</p>
        )}
      </div>
      <div>
        <h5 className="text-md font-medium">Inquilinos</h5>
        {tenants.length > 0 ? (
          tenants.map((tenantId) => (
            <p key={tenantId}>{getCustomerName(tenantId)}</p>
          ))
        ) : (
          <p>No hay inquilinos asignados.</p>
        )}
      </div>
    </div>
  );
}

ConfirmationStep.propTypes = {
  formData: PropTypes.object,
  categorias: PropTypes.array,
  clientes: PropTypes.array,
  atributos: PropTypes.array,
  previewImage: PropTypes.string,
  secondaryPreviews: PropTypes.array,
};

ConfirmationStep.defaultProps = {
  formData: {},
  categorias: [],
  clientes: [],
  atributos: [],
  previewImage: '',
  secondaryPreviews: [],
};

export default ConfirmationStep;