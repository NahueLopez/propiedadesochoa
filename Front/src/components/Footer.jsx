import React from 'react';
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

function Footer() {
  return (
    <footer className='fixed bottom-0 left-0 right-0 z-50 w-full p-2 text-center bg-black'>
      <div className="flex flex-col md:flex-row justify-between items-center gap-y-1 md:gap-y-0">
        {/* Logo */}
        <div>
          <img src={logo} className="w-[50px] h-[30px] md:w-[90px] md:h-[60px]" />
        </div>

        {/* Íconos de redes sociales */}
        <div className="flex gap-x-3 md:gap-x-6">
          <Link to="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 text-xl md:text-2xl">
            <FaWhatsapp />
          </Link>
          <Link to="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 text-xl md:text-2xl">
            <FaInstagram />
          </Link>
          <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 text-xl md:text-2xl">
            <FaFacebookF />
          </Link>
          <Link to="mailto:example@example.com" className="text-white hover:text-yellow-300 text-xl md:text-2xl">
            <IoIosMail />
          </Link>
        </div>

        {/* Enlaces de navegación (ocultos en móviles) */}
        <div className="hidden md:flex gap-x-4 md:gap-x-6">
          <Link to="/" className="text-white hover:text-yellow-300 text-sm">Inicio</Link>
          <Link to="propiedades" className="text-white hover:text-yellow-300 text-sm">Propiedades</Link>
          <Link to="sobrenosotros" className="text-white hover:text-yellow-300 text-sm">Sobre Nosotros</Link>
          <Link to="contacto" className="text-white hover:text-yellow-300 text-sm">Contacto</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;