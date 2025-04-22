import React from 'react';

function CardList({ items, onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return <p className="text-gray-500">No hay elementos para mostrar.</p>;
  }

  // Base URL para las imágenes (ajusta según tu backend)
  const BASE_URL = import.meta.env.VITE_URL_BACK || 'http://localhost:8000'; // Cambia si tu backend está en otro dominio

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <img
            src={
              item.main_image
                ? `${BASE_URL}${item.main_image}`
                : ''
            }
            alt={item.title || 'Imagen del inmueble'}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = ''; // Imagen por defecto si falla
              console.error(`Error al cargar la imagen: ${e.target.src}`);
            }}
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {item.title || 'Sin título'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{item.location || 'Sin ubicación'}</p>
            <p className="text-lg font-bold text-blue-600 mt-2">
              ${item.price ? Number(item.price).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) : 'Precio no disponible'}
            </p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                🛏️ {item.habitaciones || item.rooms || 0} | 🛁 {item.banos || item.bathrooms || 0}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardList;