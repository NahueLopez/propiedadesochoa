import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { TbHomeSearch } from "react-icons/tb";
import banner from "../../assets/banner.webp";

function Inicio() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 200);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col lg:flex-row justify-center lg:justify-between items-center px-4 sm:px-8 lg:px-20 overflow-hidden">
      {/* Contenedor del texto con luz fija */}
      <div
        className={`relative w-full lg:w-1/2 flex items-center justify-center lg:justify-start pt-8 lg:pt-20 mb-6 lg:mb-0 transition-all duration-1000 ease-in-out ${
          visible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-10 scale-95"
        }`}
      >
        {/* Luz amarilla fija */}
        <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 w-80 h-80 bg-amber-500 opacity-40 blur-3xl rounded-full"></div>

        {/* Texto con animación */}
        <div className="relative z-10 text-white text-center lg:text-left space-y-6">
          <p className="text-4xl sm:text-5xl font-medium">Tenemos la propiedad</p>
          <p className="text-5xl sm:text-6xl font-bold text-amber-500">de tus sueños.</p>

          <div className="flex justify-center lg:justify-start mt-8">
            <Link
              to="/propiedades"
              className="flex items-center text-amber-500 hover:text-white hover:bg-amber-500 border-2 border-amber-500 px-3 py-1.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-amber-500/50"
            >
              <TbHomeSearch className="mr-1.5 text-base" />
              Ver Propiedades
            </Link>
          </div>
        </div>
      </div>

      {/* Imagen con animación */}
      <div
        className={`relative w-full lg:w-1/2 flex justify-center lg:justify-end transition-all duration-1000 ease-in-out ${
          visible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-10 scale-95"
        }`}
      >
        <img
          src={banner}
          alt="Banner de propiedades inmobiliarias"
          className="w-full lg:w-auto h-auto max-h-[50%] lg:max-h-[90%] rounded-3xl shadow-xl hover:scale-105 transition-all duration-300"
        />
      </div>
    </div>
  );
}

export default Inicio;