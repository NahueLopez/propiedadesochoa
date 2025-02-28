import React, { useState } from "react";

function Filtro({ onFiltrar }) {
  const [filtros, setFiltros] = useState({
    tipo: "",
    categoria: "",
    precio: "",
  });

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const aplicarFiltro = () => {
    onFiltrar(filtros);
  };

  return (
    <div className="mt-10 w-64 bg-gray-800 bg-opacity-95 p-6 shadow-xl rounded-xl fixed left-0 top-20 transform transition-all duration-300 hover:shadow-2xl z-50">
      <h2 className="text-lg font-bold text-amber-500 mb-4">Filtrar Propiedades</h2>

      {/* Tipo */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">Tipo</label>
        <select
          name="tipo"
          value={filtros.tipo}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
        >
          <option value="">Todos</option>
          <option value="casa">Casa</option>
          <option value="departamento">Departamento</option>
          <option value="terreno">Terreno</option>
        </select>
      </div>

      {/* Categoría */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">Categoría</label>
        <select
          name="categoria"
          value={filtros.categoria}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
        >
          <option value="">Todas</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
      </div>

      {/* Precio */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">Precio Máximo</label>
        <input
          type="number"
          name="precio"
          value={filtros.precio}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          placeholder="Máximo $"
        />
      </div>

      <button
        onClick={aplicarFiltro}
        className="w-full bg-amber-500 text-gray-900 font-semibold py-2 rounded-lg hover:bg-amber-600 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Aplicar Filtros
      </button>
    </div>
  );
}

export default Filtro;