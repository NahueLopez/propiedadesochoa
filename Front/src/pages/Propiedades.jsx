import React, { useState } from "react";
import Filtro from "../components/Propiedades/Filtro";
import ListadoInmuebles from "../components/Propiedades/ListadoInmuebles";

function Propiedades() {
  const [filtros, setFiltros] = useState({
    tipo: "",
    categoria: "",
    precio: "",
    atributos: [],
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen gap-6 p-6 bg-gradient-to-br from-gray-50 to-white">
      {/* 📌 Filtro a la izquierda */}
      <div className="w-full md:w-64 p-2">
        <Filtro onFiltrar={setFiltros} />
      </div>

      {/* 📌 Listado de propiedades a la derecha */}
      <div className="flex-1 p-6 mt-2 bg-gray-100">
        <ListadoInmuebles filtros={filtros} />
      </div>
    </div>
  );
}

export default Propiedades;