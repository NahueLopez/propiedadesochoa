import React, { useState, useEffect } from "react";
import usePropiedades from "../../hooks/usePropiedades";

function ListadoInmuebles({ filtros }) {
  const propiedades = usePropiedades(); // Hook que retorna las propiedades
  const [propiedadesFiltradas, setPropiedadesFiltradas] = useState([]);

  useEffect(() => {
    if (!propiedades || propiedades.length === 0) return;

    // Filtrar propiedades según los filtros aplicados
    const filtradas = propiedades.filter((propiedad) => {
      return (
        (filtros.tipo ? propiedad.tipo === filtros.tipo : true) &&
        (filtros.categoria ? propiedad.categoria === filtros.categoria : true) &&
        (filtros.precio ? propiedad.precio <= Number(filtros.precio) : true)
      );
    });

    setPropiedadesFiltradas(filtradas);
  }, [propiedades, filtros]);

  return (
    <div className="w-full mx-auto max-w-screen-xl px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {propiedadesFiltradas.length > 0 ? (
        propiedadesFiltradas.map((propiedad) => (
          <div
            key={propiedad.id}
            className="bg-gray-800 bg-opacity-95 rounded-xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
          >
            <img
              src={propiedad.imagen}
              alt={`${propiedad.nombre} en ${propiedad.direccion}`}
              className="w-full h-56 object-cover rounded-t-xl aspect-[4/3] hover:opacity-90 transition-opacity duration-300"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-amber-500 mb-2">{propiedad.nombre}</h3>
              <p className="text-gray-400 mt-2">{propiedad.direccion}</p>
              <p className="font-semibold text-amber-500 mt-4">{`$${propiedad.precio.toLocaleString()}`}</p>
              <div className="mt-6">
                <button className="w-full bg-amber-500 text-gray-900 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-amber-600 hover:scale-105 transition-all duration-300 group-hover:ring-2 group-hover:ring-amber-500/50">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-400 text-lg font-medium">
          No se encontraron inmuebles con esos filtros.
        </p>
      )}
    </div>
  );
}

export default ListadoInmuebles;