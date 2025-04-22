import React, { useState, useEffect } from "react";
import { GetPropiedades } from "../../services/propiedadesService";
import { FaMapMarkerAlt, FaDollarSign, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ListadoInmuebles({ filtros }) {
  const [propiedadesFiltradas, setPropiedadesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_URL_BACK || "http://localhost:8000";

  useEffect(() => {
    const fetchPropiedades = async () => {
      try {
        setLoading(true);

        const params = {
          categoria: filtros.categoria || "",
          precio: filtros.precio || "",
          atributos: filtros.atributos || [],
          type: filtros.type || "",
          ubicacion: filtros.ubicacion || "",
        };

        console.log("Parámetros enviados:", params);

        const propiedades = await GetPropiedades(params);

        console.log("Propiedades recibidas:", propiedades);

        setPropiedadesFiltradas(propiedades);
        setError(null);
      } catch (err) {
        console.error("Error al cargar propiedades:", err);
        setError("Error al cargar las propiedades");
      } finally {
        setLoading(false);
      }
    };

    fetchPropiedades();
  }, [filtros]);

  // 📌 Función handleVerMas ahora recibe el id como parámetro
  const handleVerMas = (id) => {
    if (id) {
      navigate(`/propiedad/${id}`);
    } else {
      console.error("No se encontró el ID de la propiedad:", id);
    }
  };

  if (loading) return <div className="text-gray-300 text-center text-lg">Cargando propiedades...</div>;
  if (error) return <div className="text-red-500 text-center text-lg">{error}</div>;

  return (
    <div className="w-full mt-6 mx-auto max-w-screen-xl px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-content-center">
        {propiedadesFiltradas.length > 0 ? (
          propiedadesFiltradas.map((propiedad) => (
            <div
              key={propiedad.id}
              className="bg-gray-800 bg-opacity-95 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group w-full max-w-xs mx-auto"
            >
              <img
                src={
                  propiedad.main_image
                    ? `${BASE_URL}${propiedad.main_image}`
                    : "https://via.placeholder.com/300x200?text=Sin+Imagen"
                }
                alt={`${propiedad.title} en ${propiedad.address}`}
                className="w-full h-60 object-cover rounded-t-xl aspect-[4/3] hover:opacity-90 transition-opacity duration-300"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x200?text=Sin+Imagen";
                  console.error(`Error al cargar la imagen: ${e.target.src}`);
                }}
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-amber-500 mb-2">{propiedad.title}</h3>
                <p className="text-gray-400 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-amber-500" />
                  {propiedad.address}
                </p>
                {propiedad.size && (
                  <p className="text-gray-400 mt-1">Tamaño: {propiedad.size} m²</p>
                )}
                {propiedad.bedrooms && (
                  <p className="text-gray-400 mt-1">Habitaciones: {propiedad.bedrooms}</p>
                )}
                <p className="font-semibold text-amber-400 mt-3 flex items-center gap-2">
                  <FaDollarSign />
                  ${parseFloat(propiedad.price).toLocaleString()}
                </p>
                <div className="mt-5">
                  <button
                    className="cursor-pointer w-full bg-amber-500 text-gray-900 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-amber-600 hover:scale-105 transition-all duration-300 group-hover:ring-2 group-hover:ring-amber-500/50 flex items-center justify-center gap-2"
                    onClick={() => handleVerMas(propiedad.id)} // 📌 Pasamos el id al hacer clic
                  >
                    Ver detalles
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center p-6 bg-gray-800 bg-opacity-50 rounded-lg">
            <p className="text-amber-500 text-lg font-medium">
              No se encontraron inmuebles con esos filtros.
            </p>
            <p className="text-gray-400 mt-2">Prueba ajustando los filtros para ver más propiedades.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListadoInmuebles;