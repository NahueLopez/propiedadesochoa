// src/hooks/usePropiedades.js
import { useState, useEffect } from 'react';

const usePropiedades = () => {
  const [propiedades, setPropiedades] = useState([]);
  
  useEffect(() => {
    // Simulamos la obtención de propiedades de prueba
    const propiedadesDePrueba = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      nombre: `Propiedad ${index + 1}`,
      descripcion: `Descripción de la propiedad ${index + 1}. Es una propiedad fantástica ubicada en una excelente zona.`,
      direccion: "Perito 2343",
      precio: `$${(index + 1) * 100000}`,
      imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD2PYV5hA3e_j3ZsTa-ajxyAIPDtu6UDUH7g&s", // Usamos imágenes de prueba
    }));
    
    setPropiedades(propiedadesDePrueba);
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  return propiedades;
};

export default usePropiedades;
