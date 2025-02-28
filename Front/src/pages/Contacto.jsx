import React, { useEffect, useState } from "react";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaMapMarkedAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

function Contacto() {
  const [formVisible, setFormVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const formElement = document.getElementById("formulario");
      const infoElement = document.getElementById("informacion");

      if (formElement && formElement.getBoundingClientRect().top <= window.innerHeight * 0.7) {
        setFormVisible(true);
      }

      if (infoElement && infoElement.getBoundingClientRect().top <= window.innerHeight * 0.7) {
        setInfoVisible(true);
        setMapVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 gap-8">
      {/* Formulario de contacto */}
      <div
        id="formulario"
        className={`bg-gray-800 bg-opacity-95 shadow-xl rounded-2xl w-full max-w-md p-6 flex flex-col justify-between transform transition-all duration-1000 ease-in-out ${
          formVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
        }`}
      >
        <h2 className="text-xl font-bold text-amber-500 mb-4">¡Envíenos sus dudas!</h2>
        <form className="flex flex-col gap-4">
          <div className="text-left">
            <label className="font-medium text-gray-300 mb-1">Nombre y Apellido</label>
            <input
              type="text"
              placeholder="Ingrese su nombre"
              className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
          </div>
          <div className="text-left">
            <label className="font-medium text-gray-300 mb-1">Asunto</label>
            <input
              type="text"
              placeholder="Ingrese el asunto"
              className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
          </div>
          <div className="text-left">
            <label className="font-medium text-gray-300 mb-1">Mensaje</label>
            <textarea
              placeholder="Ingrese su mensaje"
              className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg h-20 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            ></textarea>
          </div>
          <button className="w-full bg-amber-500 text-gray-900 font-semibold py-2 rounded-lg hover:bg-amber-600 transition">
            Enviar
          </button>
        </form>
      </div>

      {/* Información de contacto */}
      <div
        id="informacion"
        className={`bg-gray-800 bg-opacity-95 shadow-xl rounded-2xl w-full max-w-md p-6 flex flex-col justify-between transform transition-all duration-1000 ease-in-out ${
          infoVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-10 scale-95"
        }`}
      >
        <div>
          <h2 className="text-xl font-bold text-amber-500 mb-4">Contacto</h2>
          <div className="flex flex-col gap-3 items-center text-gray-300">
            <div className="flex items-center gap-2 hover:text-amber-500 transition">
              <FaWhatsapp className="text-green-400 text-lg" />
              <span>+54 223 123 4567</span>
            </div>
            <div className="flex items-center gap-2 hover:text-amber-500 transition">
              <IoIosMail className="text-red-400 text-lg" />
              <span>contacto@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 hover:text-amber-500 transition">
              <FaMapMarkedAlt className="text-blue-400 text-lg" />
              <p>Irala 6018</p>
            </div>

            {/* Mapa */}
            <div
              className={`w-full transition-all duration-1000 ease-in-out transform ${
                mapVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3142.861143912748!2d-57.5729011!3d-38.027016499999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584de8d83ac6d3d%3A0x954a8dc17ebfdef5!2sIrala%206018%2C%20B7600%20Mar%20del%20Plata%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1739482419278!5m2!1ses-419!2sar"
                className="w-full h-28 border-0 rounded-lg mt-3 shadow-md"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-amber-500 mb-4">Redes Sociales</h2>
          <div className="flex gap-6 justify-center text-2xl">
            <FaInstagram className="text-pink-400 cursor-pointer hover:text-amber-500 hover:scale-110 transition" />
            <FaFacebookF className="text-blue-400 cursor-pointer hover:text-amber-500 hover:scale-110 transition" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacto;