import React, { useState } from "react";
import Filtro from "./Filtro";
import ListadoInmuebles from "./ListadoInmuebles";

function Propiedades() {
  const [filtros, setFiltros] = useState({ tipo: "", categoria: "", precio: "" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex">
        <Filtro onFiltrar={setFiltros} />
        <div className="flex-1 ml-64">
          <ListadoInmuebles filtros={filtros} />
        </div>
      </div>
    </div>
  );
}

export default Propiedades;