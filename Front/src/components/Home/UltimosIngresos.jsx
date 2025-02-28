import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import usePropiedades from "../../hooks/usePropiedades";
import CardUltimoIngreso from "./CardUltimoIngreso";

function UltimosIngresos() {
  const propiedades = usePropiedades();
  const [indexPrincipal, setIndexPrincipal] = useState(0);
  const [cardsVisibles, setCardsVisibles] = useState(4);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const actualizarTamano = () => {
      if (window.innerWidth < 640) {
        setCardsVisibles(1);
      } else if (window.innerWidth < 1024) {
        setCardsVisibles(3);
      } else {
        setCardsVisibles(4);
      }
    };

    actualizarTamano();
    window.addEventListener("resize", actualizarTamano);

    return () => window.removeEventListener("resize", actualizarTamano);
  }, []);

  // Detectar cuando el componente entra en la vista
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const maxIndex = propiedades.length - cardsVisibles;

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
    <div
      ref={ref}
      className={`flex flex-col items-center w-full justify-center mx-auto h-screen transition-all duration-1000 ease-in-out ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
      }`}
    >
      <p className="text-2xl text-start mb-6">Propiedades Destacadas</p>

      <div className="flex items-center gap-4 w-full max-w-[1200px] px-4">
        <button
          onClick={anterior}
          className="text-2xl p-2 bg-gray-200 rounded-full hover:cursor-pointer hover:bg-gray-300 transition disabled:opacity-50"
          disabled={indexPrincipal === 0}
        >
          <FaChevronLeft />
        </button>

        <div className="relative w-[90%] overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(indexPrincipal * 100) / cardsVisibles}%)`,
            }}
          >
            {propiedades.map((propiedad) => (
              <div 
                key={propiedad.id} 
                className="w-full sm:w-1/3 lg:w-1/4 p-2 flex-shrink-0 cursor-pointer"
              >
                <CardUltimoIngreso propiedad={propiedad} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={siguiente}
          className="text-2xl p-2 bg-gray-200 rounded-full hover:cursor-pointer hover:bg-gray-300 transition disabled:opacity-50"
          disabled={indexPrincipal === maxIndex}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

export default UltimosIngresos;
