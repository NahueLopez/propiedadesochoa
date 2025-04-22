import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaHome } from "react-icons/fa";
import { GetLatestPropiedades } from "../../services/propiedadesService";
import CardUltimoIngreso from "./CardUltimoIngreso";

function UltimosIngresos() {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [indexPrincipal, setIndexPrincipal] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const decorRef = useRef(null);

  useEffect(() => {
    const fetchPropiedades = async () => {
      try {
        setLoading(true);
        const data = await GetLatestPropiedades();
        console.log("Datos recibidos en UltimosIngresos:", data);
        setPropiedades(data);
        setError(null);
      } catch (err) {
        console.error("Error en fetchPropiedades:", err);
        setError(err.message || "Error al cargar propiedades");
        setPropiedades([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPropiedades();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log("IntersectionObserver - isIntersecting:", entry.isIntersecting);
        if (entry.isIntersecting) {
          setVisible(true);
          console.log("Elemento visible, activando animación");
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      console.log("Observando carrusel:", ref.current);
      observer.observe(ref.current);
    }
    if (decorRef.current) {
      console.log("Observando decorativo:", decorRef.current);
      observer.observe(decorRef.current);
    }

    const timeout = setTimeout(() => {
      if (!visible) {
        console.log("Forzando visibilidad después de 2 segundos");
        setVisible(true);
      }
    }, 2000);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      if (decorRef.current) {
        observer.unobserve(decorRef.current);
      }
      clearTimeout(timeout);
    };
  }, []);

  // Determinar cards visibles según breakpoint
  const getVisibleColumns = () => {
    if (window.innerWidth < 768) return 1; // sm
    if (window.innerWidth < 1024) return 2; // md
    if (window.innerWidth < 1280) return 3; // lg
    return 4; // xl
  };

  const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns());

  useEffect(() => {
    const actualizarColumnas = () => {
      setVisibleColumns(getVisibleColumns());
    };

    actualizarColumnas();
    window.addEventListener("resize", actualizarColumnas);

    return () => window.removeEventListener("resize", actualizarColumnas);
  }, []);

  console.log("Estado actual - Loading:", loading, "Error:", error, "Propiedades:", propiedades);
  console.log("Visible:", visible, "VisibleColumns:", visibleColumns);

  if (loading) return <div className="text-center text-black">Cargando propiedades...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  const maxIndex = Math.max(0, propiedades.length - visibleColumns);

  const siguiente = () => {
    if (indexPrincipal < maxIndex) {
      setIndexPrincipal((prevIndex) => prevIndex + 1);
    }
  };

  const anterior = () => {
    if (indexPrincipal > 0) {
      setIndexPrincipal((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full justify-center mx-auto min-h-[70vh] p-4 bg-gradient-to-br from-blue-50 to-white">
      {/* Elemento decorativo (entra desde la derecha) */}
      <div
        ref={decorRef}
        className={`absolute left-0 top-0 w-1/2 h-1/2 bg-gradient-to-r from-amber-100/20 to-transparent rounded-br-[100px] transition-all duration-1000 ease-in-out transform ${
          visible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-10 scale-95"
        }`}
      ></div>

      {/* Carrusel (entra desde la izquierda) */}
      <div
        ref={ref}
        className={`relative z-10 flex flex-col items-center w-full max-w-[1400px] transition-all duration-1000 ease-in-out transform ${
          visible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-10 scale-95"
        }`}
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2">
            <FaHome className="text-amber-500 text-3xl sm:text-4xl" />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Nuevas Propiedades</h2>
          </div>
          <p className="text-lg text-amber-600 mt-2">Descubre las últimas propiedades disponibles</p>
        </div>

        <div className="relative flex items-center gap-2 w-full px-2 sm:gap-4 sm:px-4">
          <button
            onClick={anterior}
            className="absolute left-2 sm:static text-xl sm:text-2xl p-2 sm:p-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md z-10"
            disabled={indexPrincipal === 0}
            aria-label="Propiedad anterior"
          >
            <FaChevronLeft />
          </button>

          <div className="relative w-full overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${(indexPrincipal * 100) / visibleColumns}%)`,
                minWidth: "100%",
              }}
            >
              {propiedades.length > 0 ? (
                propiedades.map((propiedad) => (
                  <div
                    key={propiedad.id}
                    className="flex-shrink-0 p-3 transition-transform duration-300 hover:scale-105"
                    style={{ width: `${100 / visibleColumns}%` }}
                  >
                    <CardUltimoIngreso propiedad={propiedad} />
                  </div>
                ))
              ) : (
                <p className="text-center w-full text-gray-800">No hay propiedades disponibles</p>
              )}
            </div>
          </div>

          <button
            onClick={siguiente}
            className="absolute right-2 sm:static text-xl sm:text-2xl p-2 sm:p-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md z-10"
            disabled={indexPrincipal >= maxIndex}
            aria-label="Siguiente propiedad"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Indicadores del carrusel */}
        {propiedades.length > visibleColumns && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: Math.ceil(propiedades.length / visibleColumns) }).map((_, idx) => (
              <div
                key={idx}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  idx === indexPrincipal ? "bg-amber-500 scale-125" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
        </div>
    </div>
  );
}

export default UltimosIngresos;