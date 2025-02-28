import React from 'react';
import { FaArrowRight } from 'react-icons/fa'; // Necesitarás instalar react-icons: npm install react-icons

function CardUltimoIngreso({ propiedad }) {
  return (
    <div className="max-w-xs bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl relative group">
      <img
        src={propiedad.imagen}
        alt={`${propiedad.nombre} en ${propiedad.direccion}`}
        className="w-full h-48 object-cover rounded-t-xl aspect-[4/3]"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-amber-500 mb-2">{propiedad.nombre}</h3>
        <p className="text-sm text-gray-400 mb-4">{propiedad.direccion}</p>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-bold text-amber-500">{`$${propiedad.precio.toLocaleString()}`}</p>
          <button className="flex items-center text-gray-900 bg-amber-500 shadow-xl hover:cursor-pointer hover:bg-amber-600 px-4 py-2 rounded-lg text-sm transition duration-200 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
            Ver más <FaArrowRight className="ml-2 text-sm" />
          </button>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <p>Superficie: {propiedad.superficie} m²</p>
          <p>{propiedad.banio} Baños</p>
        </div>
      </div>
    </div>
  );
}

export default CardUltimoIngreso;