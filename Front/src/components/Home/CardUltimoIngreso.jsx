import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function CardUltimoIngreso({ propiedad }) {

  const navigate = useNavigate();
  const precioNumerico = parseFloat(propiedad.price) || 0;
  const BASE_URL = import.meta.env.VITE_URL_BACK || "http://localhost:8000";
  
  const handleVerMas = () => {
    if (propiedad.id) {
      navigate(`/propiedad/${propiedad.id}`); 
    } else {
      console.error("No se encontró el ID de la propiedad:", propiedad);
    }
  };

  return (
    <div className="max-w-xs bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl relative group">
      <img
        src={
          propiedad.main_image
            ? `${BASE_URL}${propiedad.main_image}`
            : "https://via.placeholder.com/300x200?text=Sin+Imagen"
        }
        alt={`${propiedad.title || "Sin título"} en ${propiedad.address || "Sin dirección"}`}
        className="w-full h-48 object-cover rounded-t-xl aspect-[4/3]"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x200?text=Sin+Imagen";
          console.error(`Error al cargar la imagen: ${e.target.src}`);
        }}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-amber-500 mb-2">{propiedad.title || "Sin título"}</h3>
        <p className="text-sm text-gray-400 mb-4">{propiedad.address || "Sin dirección"}</p>

        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-bold text-amber-500">{`$${precioNumerico.toLocaleString()}`}</p>
          <button 
           onClick={handleVerMas}
           className="flex items-center text-gray-900 bg-amber-500 shadow-xl hover:cursor-pointer hover:bg-amber-600 px-4 py-2 rounded-lg text-sm transition duration-200 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
            Ver más <FaArrowRight className="ml-2 text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardUltimoIngreso;