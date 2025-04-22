import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropiedad } from '../services/propiedadesService';
import { FaWhatsapp, FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaArrowsAlt, FaTimes } from 'react-icons/fa';
import { GoogleMap, Marker } from '@react-google-maps/api';

function DetallePropiedad() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [propiedad, setPropiedad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [propiedadesSimilares, setPropiedadesSimilares] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);
  const [mapCenter, setMapCenter] = useState(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  const BASE_URL = import.meta.env.VITE_URL_BACK || "http://localhost:8000";
  console.log("BASE_URL:", BASE_URL);

  // Verificar si la API de Google Maps está cargada
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps) {
        setIsGoogleMapsLoaded(true);
      } else {
        const timer = setInterval(() => {
          if (window.google && window.google.maps) {
            setIsGoogleMapsLoaded(true);
            clearInterval(timer);
          }
        }, 100);
        return () => clearInterval(timer);
      }
    };

    checkGoogleMapsLoaded();
  }, []);

  // Cargar la propiedad
  useEffect(() => {
    const fetchPropiedad = async () => {
      try {
        setLoading(true);
        const data = await getPropiedad(id);
        console.log("Datos recibidos en DetallePropiedad:", data);
        setPropiedad(data);
        setError(null);

        setPropiedadesSimilares([]);
      } catch (err) {
        console.error("Error al cargar la propiedad:", err);
        setError(err.message || "Error al cargar la propiedad");
        setPropiedad(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPropiedad();
  }, [id]);

  // Geocodificar la dirección cuando la API de Google Maps esté cargada
  const geocodeAddress = useCallback(() => {
    if (!isGoogleMapsLoaded || !propiedad?.address) {
      setMapCenter(null);
      return;
    }

    const fullAddress = `${propiedad.address}${propiedad.ubicacion?.name ? `, ${propiedad.ubicacion.name}` : ''}, Argentina`;
    console.log("Geocodificando dirección:", fullAddress);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: fullAddress }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        setMapCenter({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        console.error("Error al geocodificar la dirección:", status);
        setMapCenter(null);
      }
    });
  }, [isGoogleMapsLoaded, propiedad]);

  // Ejecutar geocodificación cuando la API esté cargada y la propiedad esté disponible
  useEffect(() => {
    if (isGoogleMapsLoaded && propiedad) {
      geocodeAddress();
    }
  }, [isGoogleMapsLoaded, propiedad, geocodeAddress]);

  // Función para manejar el contacto vía WhatsApp
  const handleContact = () => {
    const url = window.location.href;
    const text = `Mira esta propiedad: ${propiedad?.title} - ${url}`;
    const phoneNumber = '+5492235217128';
    const shareUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  };

  const images = [];
  if (propiedad?.main_image) {
    images.push(propiedad.main_image);
  }
  if (propiedad?.images?.length > 0) {
    const additionalImages = propiedad.images.map(img => img.image_path);
    images.push(...additionalImages);
  }
  if (images.length === 0) {
    images.push("https://via.placeholder.com/600x400?text=Sin+Imagen");
  }
  console.log("Imágenes a cargar:", images);

  // Asegurarse de que currentImageIndex esté dentro de los límites
  const validIndex = Math.max(0, Math.min(currentImageIndex, images.length - 1));
  const imageSrc = images[validIndex];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Funciones para el modal de pantalla completa
  const openFullScreen = () => {
    setFullScreenImageIndex(currentImageIndex);
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  const nextFullScreenImage = () => {
    setFullScreenImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevFullScreenImage = () => {
    setFullScreenImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors duration-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!propiedad) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Propiedad no encontrada</p>
          <button
            onClick={() => navigate('/')}
            className="bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors duration-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const precioNumerico = parseFloat(propiedad.price) || 0;

  return (
    <div className="mt-10 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/propiedades')}
            className="flex items-center text-amber-500 hover:text-amber-600 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver al inicio
          </button>
        </div>

        {/* Sección de imágenes (con bordes redondeados) */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Imagen principal */}
            <div className="relative w-full lg:w-1/2">
              {images.length > 0 ? (
                <>
                  <img
                    src={`${BASE_URL}${imageSrc}`}
                    alt={`Imagen ${currentImageIndex + 1} de ${propiedad.title}`}
                    className="w-full h-[350px] object-cover rounded-lg"
                    onError={(e) => {
                      const originalSrc = e.target.src;
                      console.error(`Error al cargar la imagen: ${originalSrc}`);
                      e.target.src = "https://via.placeholder.com/600x400?text=Sin+Imagen";
                    }}
                  />
                  <button
                    onClick={openFullScreen}
                    className="absolute top-4 right-4 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full hover:bg-opacity-100 transition-colors duration-200"
                    title="Ver en pantalla completa"
                  >
                    <FaArrowsAlt />
                  </button>
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-3 rounded-full hover:bg-opacity-100 transition-colors duration-200"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-3 rounded-full hover:bg-opacity-100 transition-colors duration-200"
                      >
                        <FaChevronRight />
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                          <span
                            key={index}
                            className={`rounded-full ${
                              index === currentImageIndex ? 'bg-amber-500 h-4 w-4' : 'bg-gray-400 h-2 w-2'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-[350px] flex items-center justify-center bg-gray-700 rounded-lg">
                  <p className="text-gray-400">No hay imágenes disponibles</p>
                </div>
              )}
            </div>

            {/* Imágenes secundarias (cuadrícula 2x2) */}
            {images.length > 1 && (
              <div className="grid grid-cols-2 gap-4 w-full lg:w-1/2">
                {images.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className="w-full h-[167px] overflow-hidden"
                  >
                    <img
                      src={`${BASE_URL}${img}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        const originalSrc = e.target.src;
                        console.error(`Error al cargar la imagen: ${originalSrc}`);
                        e.target.src = "https://via.placeholder.com/150x100?text=Sin+Imagen";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Modal de pantalla completa */}
          {isFullScreen && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
              <button
                onClick={closeFullScreen}
                className="absolute top-4 right-4 text-white p-2 rounded-full bg-gray-800 bg-opacity-75 hover:bg-opacity-100 transition-colors duration-200"
                title="Cerrar pantalla completa"
              >
                <FaTimes size={24} />
              </button>
              <img
                src={`${BASE_URL}${images[fullScreenImageIndex]}`}
                alt={`Imagen ${fullScreenImageIndex + 1} de ${propiedad.title}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onError={(e) => {
                  const originalSrc = e.target.src;
                  console.error(`Error al cargar la imagen: ${originalSrc}`);
                  e.target.src = "https://via.placeholder.com/600x400?text=Sin+Imagen";
                }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevFullScreenImage}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-3 rounded-full hover:bg-opacity-100 transition-colors duration-200"
                  >
                    <FaChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextFullScreenImage}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-3 rounded-full hover:bg-opacity-100 transition-colors duration-200"
                  >
                    <FaChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <span
                        key={index}
                        className={`rounded-full ${
                          index === fullScreenImageIndex ? 'bg-amber-500 h-4 w-4' : 'bg-gray-400 h-2 w-2'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Sección de información debajo de las imágenes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-start items-start gap-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-semibold text-amber-500 mb-2">
                    {propiedad.title || "Sin título"}
                  </h2>
                  <p className="text-gray-400 mb-2">
                    <span className="font-medium"></span>{' '}
                    {propiedad.description || 'Sin descripción'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="border border-amber-300 rounded-lg px-3 py-1">
                    <p className="text-2xl font-bold text-amber-500">
                      USD {precioNumerico.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleContact}
                  className="flex items-center bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors duration-200"
                >
                  Contactar <FaWhatsapp className="ml-2" />
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-amber-500 mb-4">Características principales</h3>
              <ul className="text-gray-400 list-disc list-inside">
                <li>Categoría: {propiedad.category?.name || 'N/A'}</li>
                <li>Tipo: {propiedad.type?.name || 'N/A'}</li>
                <li>Ubicación: {propiedad.ubicacion?.name || 'N/A'}</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-amber-500 mb-4">Ubicación</h3>
              {isGoogleMapsLoaded && mapCenter ? (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '200px', borderRadius: '8px' }}
                  center={mapCenter}
                  zoom={15}
                >
                  <Marker position={mapCenter} />
                </GoogleMap>
              ) : (
                <div className="flex items-center justify-center bg-gray-700 h-48 rounded-lg">
                  <FaMapMarkerAlt className="text-amber-500 text-3xl" />
                  <p className="text-gray-400 ml-2">
                    {isGoogleMapsLoaded
                      ? propiedad?.address
                        ? 'No se pudo geocodificar la dirección'
                        : 'Dirección no disponible'
                      : 'Cargando mapa...'}
                  </p>
                </div>
              )}
              <p className="text-gray-400 mt-4">
                Dirección: {propiedad.address || 'N/A'}
              </p>
            </div>

            {propiedad.attributes && propiedad.attributes.length > 0 && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-amber-500 mb-4">Atributos</h3>
                <ul className="list-disc list-inside text-gray-400">
                  {propiedad.attributes.map((atributo) => (
                    <li key={atributo.id}>
                      {atributo.name}
                      {atributo.pivot?.value && ` (${atributo.pivot.value})`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {propiedadesSimilares.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-amber-500 mb-4">Propiedades similares</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {propiedadesSimilares.map((similar) => (
                <div
                  key={similar.id}
                  className="bg-gray-700 rounded-lg shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/propiedad/${similar.id}`)}
                >
                  <img
                    src={
                      similar.main_image
                        ? `${BASE_URL}${similar.main_image}`
                        : "https://via.placeholder.com/300x200?text=Sin+Imagen"
                    }
                    alt={similar.title}
                    className="w-full h-40 object-cover rounded-lg"
                    onError={(e) => {
                      const originalSrc = e.target.src;
                      console.error(`Error al cargar la imagen: ${originalSrc}`);
                      e.target.src = "https://via.placeholder.com/300x200?text=Sin+Imagen";
                    }}
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-amber-500">{similar.title}</h4>
                    <p className="text-gray-400">{similar.address}</p>
                    <p className="text-amber-500 font-bold">
                      ${parseFloat(similar.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetallePropiedad;