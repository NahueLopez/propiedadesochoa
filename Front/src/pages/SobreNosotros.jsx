import React, { useEffect, useState } from 'react';

function SobreNosotros() {
  const [visible, setVisible] = useState(false);
  const [mousePosition1, setMousePosition1] = useState({ x: -1000, y: -1000 });
  const [mousePosition2, setMousePosition2] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    const div1 = document.getElementById('div1');
    const div2 = document.getElementById('div2');
    if (div1 && div2) {
      observer.observe(div1);
      observer.observe(div2);
    }

    return () => {
      if (div1 && div2) {
        observer.unobserve(div1);
        observer.unobserve(div2);
      }
    };
  }, []);

  const handleMouseMove1 = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition1({ x, y });
  };

  const handleMouseMove2 = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition2({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition1({ x: -1000, y: -1000 });
    setMousePosition2({ x: -1000, y: -1000 });
  };

  return (
    <div className="flex flex-col w-full py-12 bg-gradient-to-br from-gray-900 via-black to-gray-800 items-center justify-center">
      {/* Contenedor principal */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mt-14">
        {/* Primer div: entra desde la izquierda */}
        <div
          id="div1"
          className={`relative bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-1000 ease-in-out transform overflow-hidden ${
            visible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-10 scale-95'
          }`}
          onMouseMove={handleMouseMove1}
          onMouseLeave={handleMouseLeave}
          style={{
            background: `radial-gradient(circle 150px at ${mousePosition1.x}px ${mousePosition1.y}px, rgba(245, 197, 24, 0.2), rgba(31, 41, 55, 0.9))`,
          }}
        >
          <h3 className="text-2xl font-semibold text-amber-500 mb-4">Nuestros Servicios</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-amber-500 mr-2 animate-pulse">►</span>
              <p className="text-lg text-gray-200">
                Tasamos y actualizamos su propiedad a un precio de plaza actual <span className="font-semibold">(sin cargo)</span>.
              </p>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2 animate-pulse">►</span>
              <p className="text-lg text-gray-200">
                Gestionamos créditos bancarios para comprar o refaccionar su inmueble.
              </p>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2 animate-pulse">►</span>
              <p className="text-lg text-gray-200">
                Efectuamos trámites sucesorios, hipotecarios, levantamiento de embargos, etc. Contamos además con el mejor estudio de abogados tanto en el fuero civil como penal.
              </p>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2 animate-pulse">►</span>
              <p className="text-lg text-gray-200">
                Administramos su alquiler 36 meses a un costo mínimo, con garantía de cobro del 1 al 10 de cada mes.
              </p>
            </li>
          </ul>
        </div>

        {/* Segundo div: entra desde la derecha */}
        <div
          id="div2"
          className={`relative bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-1000 ease-in-out transform overflow-hidden ${
            visible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-10 scale-95'
          }`}
          onMouseMove={handleMouseMove2}
          onMouseLeave={handleMouseLeave}
          style={{
            background: `radial-gradient(circle 150px at ${mousePosition2.x}px ${mousePosition2.y}px, rgba(245, 197, 24, 0.2), rgba(31, 41, 55, 0.9))`,
          }}
        >
          <h3 className="text-2xl font-semibold text-amber-500 mb-4">¿Por qué elegirnos?</h3>
          <div className="space-y-4">
            <p className="text-lg text-gray-200">
              Le ofrecemos una gestión ágil, rápida y efectiva para una pronta solución a su problema. Disponemos de una importante cartera de clientes e inversores con pedidos concretos en diferentes puntos de la ciudad.
            </p>
            <p className="text-lg text-gray-200 italic">
              "No se quede con una sola opinión, consúltenos sin compromiso."
            </p>
            <div className="border-t border-gray-700 pt-4">
              <p className="text-lg text-gray-200">
                <span className="font-semibold">Colegio Único de Corredores Inmobiliarios de la Ciudad de Buenos Aires</span>
              </p>
              <p className="text-lg text-gray-200">
                Matrícula: <span className="font-semibold">N°2651</span>
              </p>
              <p className="text-lg text-gray-200 mt-2">
                Lo saludan atentamente, <span className="font-semibold text-amber-500">Ochoa Propiedades</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SobreNosotros;