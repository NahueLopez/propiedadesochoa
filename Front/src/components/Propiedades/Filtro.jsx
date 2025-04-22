import React, { useState, useEffect } from "react";
import { GetCategorias } from "../../services/categoriasService";
import { GetAtributos } from "../../services/atributosService";
import { GetTypes } from "../../services/typeService";
import { GetUbicacions } from "../../services/ubicacionService";
import Loader from "../Loader";

function Filtro({ onFiltrar }) {
  const [filtros, setFiltros] = useState({
    categoria: "",
    precio: "",
    atributos: [],
    type: "",
    ubicacion: "",
  });
  const [categorias, setCategorias] = useState([]);
  const [atributos, setAtributos] = useState([]);
  const [types, setTypes] = useState([]);
  const [ubicacions, setUbicacions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const rangosPrecios = [
    "Menos de 25000",
    "Entre 25000 y 50000",
    "Más de 50000",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriasData = await GetCategorias();
        const atributosData = await GetAtributos();
        const typesData = await GetTypes();
        const ubicacionsData = await GetUbicacions();

        const categoriasFormatted = categoriasData.map((categoria) =>
          typeof categoria === "string" ? categoria : categoria.name
        );
        const atributosFormatted = atributosData.map((atributo) =>
          typeof atributo === "string" ? atributo : atributo.name
        );
        const typesFormatted = typesData.map((type) =>
          typeof type === "string" ? type : type.name
        );
        const ubicacionsFormatted = ubicacionsData.map((ubicacion) =>
          typeof ubicacion === "string" ? ubicacion : ubicacion.name
        );

        setCategorias(categoriasFormatted);
        setAtributos(atributosFormatted);
        setTypes(typesFormatted);
        setUbicacions(ubicacionsFormatted);
        setError(null);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar los filtros");
        setCategorias([]);
        setAtributos([]);
        setTypes([]);
        setUbicacions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "atributos") {
      if (checked) {
        setFiltros({
          ...filtros,
          atributos: [...filtros.atributos, value],
        });
      } else {
        setFiltros({
          ...filtros,
          atributos: filtros.atributos.filter((atributo) => atributo !== value),
        });
      }
    } else {
      setFiltros({ ...filtros, [name]: value });
    }
  };

  const aplicarFiltro = () => {
    onFiltrar(filtros);
    setIsOpen(false);
  };

  if (loading) return <Loader message="Cargando filtros..." />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-150 left-4 z-40 bg-amber-500 text-gray-900 font-semibold py-1 px-3 rounded-lg shadow-md hover:bg-amber-600 transition-all duration-300 text-sm"
      >
        Filtros
      </button>

      <div
        className={`max-h-screen h-full fixed left-0 w-64 bg-gray-800 bg-opacity-95 p-6 shadow-xl z-50 transform transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 top-16 bottom-20 md:overflow-y-auto`}
      >
        <h2 className="text-lg font-bold text-amber-500 mb-4">Filtrar Propiedades</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Categoría</label>
          {categorias.length > 0 ? (
            <select
              name="categoria"
              value={filtros.categoria}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            >
              <option value="">Todas</option>
              {categorias.map((categoria, index) => (
                <option key={index} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-400 text-sm">No hay categorías disponibles</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Tipo</label>
          {types.length > 0 ? (
            <select
              name="type"
              value={filtros.type}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            >
              <option value="">Todos</option>
              {types.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-400 text-sm">No hay tipos disponibles</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Ubicación</label>
          {ubicacions.length > 0 ? (
            <select
              name="ubicacion"
              value={filtros.ubicacion}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            >
              <option value="">Todas</option>
              {ubicacions.map((ubicacion, index) => (
                <option key={index} value={ubicacion}>
                  {ubicacion}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-400 text-sm">No hay ubicaciones disponibles</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Rango de Precio</label>
          <select
            name="precio"
            value={filtros.precio}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          >
            <option value="">Cualquier precio</option>
            {rangosPrecios.map((rango, index) => (
              <option key={index} value={rango}>
                {rango}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Atributos</label>
          {atributos.length > 0 ? (
            <div className="space-y-2">
              {atributos.map((atributo, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    name="atributos"
                    value={atributo}
                    checked={filtros.atributos.includes(atributo)}
                    onChange={handleChange}
                    className="h-4 w-4 text-amber-500 border-gray-600 rounded focus:ring-amber-500 bg-gray-700"
                  />
                  <label className="ml-2 text-sm text-gray-200">{atributo}</label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No hay atributos disponibles</p>
          )}
        </div>

        <button
          onClick={aplicarFiltro}
          className="w-full bg-amber-500 text-gray-900 font-semibold py-2 rounded-lg hover:bg-amber-600 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Aplicar Filtros
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Filtro;