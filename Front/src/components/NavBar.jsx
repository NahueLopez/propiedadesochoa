import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom"; // Importamos useLocation para detectar la ruta actual
import logo from "../assets/logo.png";
import { FaBars, FaTimes } from "react-icons/fa"; // Para el menú hamburguesa

function NavBar() {
  const [scroll, setScroll] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú móvil
  const location = useLocation(); // Obtenemos la ruta actual

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 w-full py-3 px-6 text-left items-center shadow-md z-50 transition-all duration-300 ${
        scroll ? "bg-gradient-to-r from-gray-900 via-black to-gray-800 shadow-2xl" : "bg-gradient-to-r from-gray-900/80 via-black/80 to-gray-800/80"
      }`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo con luz blanca agrandada */}
        <Link to="/" className="flex items-center relative">
          <div
            className="absolute -left-4 -top-4 w-24 h-24 bg-white opacity-20 blur-2xl rounded-full"
            style={{ filter: 'blur(20px)' }}
          ></div>
          <img src={logo} alt="Ochoa Propiedades Logo" className="w-auto h-10 relative z-10 transition-transform duration-300 hover:scale-105" />
        </Link>

        {/* Menú hamburguesa para móvil */}
        <button
          className="md:hidden text-white text-2xl p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Enlaces - Desktop y Móvil */}
        <div className={`md:flex gap-6 items-center ${isMenuOpen ? "fixed inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-opacity-95 flex flex-col items-center justify-center space-y-6 text-xl z-40" : "hidden md:flex"}`}>
          <Link
            to="/"
            className={`font-semibold px-3 py-1.5 rounded transition-all duration-300 focus:ring-2 focus:ring-amber-500 ${
              location.pathname === "/" ? "text-amber-500" : "text-white hover:text-amber-600 hover:underline hover:scale-105"
            }`}
            aria-label="Inicio"
          >
            Inicio
          </Link>
          <Link
            to="/propiedades"
            className={`font-semibold px-3 py-1.5 rounded transition-all duration-300 focus:ring-2 focus:ring-amber-500 ${
              location.pathname === "/propiedades" ? "text-amber-500" : "text-white hover:text-amber-600 hover:underline hover:scale-105"
            }`}
            aria-label="Propiedades"
          >
            Propiedades
          </Link>
          <Link
            to="/sobrenosotros"
            className={`font-semibold px-3 py-1.5 rounded transition-all duration-300 focus:ring-2 focus:ring-amber-500 ${
              location.pathname === "/sobrenosotros" ? "text-amber-500" : "text-white hover:text-amber-600 hover:underline hover:scale-105"
            }`}
            aria-label="Sobre Nosotros"
          >
            Sobre Nosotros
          </Link>
          <Link
            to="/contacto"
            className={`font-semibold px-3 py-1.5 rounded transition-all duration-300 focus:ring-2 focus:ring-amber-500 ${
              location.pathname === "/contacto" ? "text-amber-500" : "text-white hover:text-amber-600 hover:underline hover:scale-105"
            }`}
            aria-label="Contacto"
          >
            Contacto
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;