import PropTypes from 'prop-types';

function AttributesStep({ atributos, formData, handleChange }) {
  return (
    <div className="space-y-2">
      <h4 className="text-lg font-semibold text-gray-800">Atributos del Inmueble</h4>
      <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-2">
        <ul className="space-y-1">
          {atributos.map((atributo) => (
            <li
              key={atributo.id}
              className="flex items-center justify-between p-1 bg-gray-50 rounded-md"
            >
              <span className="text-xs font-medium text-gray-700 w-2/3 truncate">{atributo.name}</span>
              {atributo.type === 'boolean' ? (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name={`atributo_${atributo.id}`}
                    checked={formData.atributos[atributo.id] === true} // Comparación estricta
                    onChange={handleChange}
                    className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-1 text-xs text-gray-600">Sí</span>
                </div>
              ) : (
                <input
                  type="number"
                  name={`atributo_${atributo.id}`}
                  value={formData.atributos[atributo.id] !== undefined ? Number(formData.atributos[atributo.id]) : ''} // Convertir a número
                  onChange={handleChange}
                  className="w-1/4 p-1 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all text-right"
                  placeholder="0"
                  min="0"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

AttributesStep.propTypes = {
  atributos: PropTypes.array.isRequired,
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default AttributesStep;