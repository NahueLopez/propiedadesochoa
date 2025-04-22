// src/components/inmueble-modal-steps/ImagesStep.jsx
import PropTypes from 'prop-types';

function ImagesStep({ formData, previewImage, secondaryPreviews, handleFileChange, handleRemoveImage }) {
  const baseUrl = import.meta.env.VITE_URL_BACK || 'http://localhost:8000'; // Usar la variable de entorno para la URL base

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal</label>
          <div className="mb-2">
            {(formData.main_image || previewImage) && (
              <div className="relative">
                <img
                  src={previewImage || `${baseUrl}${formData.main_image}`} // Usar baseUrl
                  alt="Imagen principal"
                  className="w-full h-48 object-cover rounded-lg mb-2 shadow-md"
                  onError={(e) => {
                    e.target.src = '';
                    console.error(`Error al cargar la imagen: ${e.target.src}`);
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(0, true)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm transition-colors"
                >
                  Eliminar
                </button>
              </div>
            )}
            <input
              type="file"
              name="main_image_file"
              onChange={(e) => handleFileChange(e, true)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              accept="image/*"
              required
            />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes Secundarias</label>
          <div className="mb-2 flex flex-wrap gap-2">
            {secondaryPreviews.map((preview, index) => (
              <div key={index} className="relative inline-block">
                <img
                  src={preview}
                  alt={`Imagen secundaria ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                    console.error(`Error al cargar la imagen: ${e.target.src}`);
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, false)}
                  className="absolute top-1 right-1 bg-red-600 text-white px-1 py-1 rounded-full text-xs hover:bg-red-700 transition-colors"
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            name="secondary_images"
            onChange={(e) => handleFileChange(e, false)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            accept="image/*"
            multiple
          />
        </div>
      </div>
    </div>
  );
}

ImagesStep.propTypes = {
  formData: PropTypes.object.isRequired,
  previewImage: PropTypes.string.isRequired,
  secondaryPreviews: PropTypes.array.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
};

export default ImagesStep;
