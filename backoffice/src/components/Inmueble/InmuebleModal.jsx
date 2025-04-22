  import { useState, useEffect } from 'react';
  import PropTypes from 'prop-types';
  import { getCategorias } from '../../services/CategoriaService';
  import { getUbicaciones } from '../../services/UbicacionService';
  import { getTipos } from '../../services/TipoService';
  import { getCustomers } from '../../services/CustomerService';
  import { getAtributos } from '../../services/AtributoService';
  import { deleteInmueble } from '../../services/InmuebleService';
  import BasicInfoStep from './BasicInfoStep';
  import ImagesStep from './ImagesStep';
  import AttributesStep from './AttributesStep';
  import RelationshipsStep from './RelationshipsStep';
  import ConfirmationStep from './ConfirmationStep';

  function InmuebleModal({ inmueble, onSave, onClose, onDelete }) {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      address: '',
      price: '',
      ubicacion_id: '', 
      type_id: '', 
      main_image: '',
      status: 'available',
      category_id: '',
      owners: [],
      clients: [],
      tenants: [],
      atributos: {},
      main_image_file: null,
      secondary_images: [],
      existingSecondaryImages: [], 
    });

    const baseUrl = import.meta.env.VITE_URL_BACK || 'http://localhost:8000';

    const [previewImage, setPreviewImage] = useState('');
    const [secondaryPreviews, setSecondaryPreviews] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [atributos, setAtributos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          const [categoriasData, ubicacionesData, tiposData, clientesData, atributosData] = await Promise.all([
            getCategorias(),
            getUbicaciones(),
            getTipos(),
            getCustomers(),
            getAtributos(),
          ]);
          setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
          setUbicaciones(Array.isArray(ubicacionesData) ? ubicacionesData : []);
          setTipos(Array.isArray(tiposData) ? tiposData : []);
          setClientes(Array.isArray(clientesData) ? clientesData : []);
          setAtributos(Array.isArray(atributosData) ? atributosData : []);
        } catch (err) {
          setError('Error al cargar datos. Revisa la consola para más detalles.');
          console.error('Error al cargar datos:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);

    useEffect(() => {
      if (inmueble) {
        const atributosValues = {};
        if (inmueble.attributes && Array.isArray(inmueble.attributes)) {
          inmueble.attributes.forEach((attr) => {
            atributosValues[attr.id] = attr.pivot && attr.pivot.value !== undefined ? attr.pivot.value : (attr.value || '');
          });
        }
        const customers = Array.isArray(inmueble.customers) ? inmueble.customers : [];
        const existingImages = inmueble.images && Array.isArray(inmueble.images)
          ? inmueble.images?.filter((img) => img.image_path).map((img) => `${baseUrl}${img.image_path}`)
          : [];
        setFormData({
          title: inmueble.title || '',
          description: inmueble.description || '',
          address: inmueble.address || '',
          price: inmueble.price || '',
          ubicacion_id: inmueble.ubicacion_id || '',
          type_id: inmueble.type_id || '',
          main_image: inmueble.main_image || '',
          status: inmueble.status || 'available',
          category_id: inmueble.category_id || '',
          owners: customers.filter(c => c?.pivot?.role === 'owner').map(c => String(c.id)) || [],
          tenants: customers.filter(c => c?.pivot?.role === 'tenant').map(c => String(c.id)) || [],
          atributos: atributosValues,
          main_image_file: null,
          secondary_images: [],
          existingSecondaryImages: existingImages,
        });
        setPreviewImage(inmueble.main_image ? `${baseUrl}${inmueble.main_image}` : '');
        setSecondaryPreviews(existingImages);
      } else {
        setSecondaryPreviews([]);
      }
    }, [inmueble]);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      console.log(`handleChange - ${name}:`, value, 'Type:', typeof value);
      if (name.startsWith('atributo_')) {
        const atributoId = name.split('_')[1];
        const newValue = type === 'checkbox' ? checked : value;
        setFormData((prevData) => ({
          ...prevData,
          atributos: {
            ...prevData.atributos,
            [atributoId]: newValue,
          },
        }));
      } else if (name === 'owners' || name === 'tenants') {
        const newValue = Array.isArray(value) ? value : value ? [value] : [];
        setFormData((prevData) => ({ ...prevData, [name]: newValue }));
      } else {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    };

    const handleFileChange = (e, isMain = true) => {
      console.log('handleFileChange - isMain:', isMain, 'Files:', e.target.files);
      console.log('formData antes:', formData);
    
      if (isMain) {
        const file = e.target.files[0];
        if (file) {
          setFormData((prevData) => {
            const newData = { ...prevData, main_image_file: file };
            console.log('formData después (main):', newData);
            return newData;
          });
          setPreviewImage(URL.createObjectURL(file));
        }
      } else {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          const newSecondaryImages = [...formData.secondary_images, ...files];
          setFormData((prevData) => {
            const newData = { ...prevData, secondary_images: newSecondaryImages };
            console.log('formData después (secondary):', newData);
            return newData;
          });
          const newPreviews = files.map((file) => URL.createObjectURL(file));
          setSecondaryPreviews((prev) => [...prev, ...newPreviews]);
        }
      }
    };

    const handleRemoveImage = (index, isMain = true) => {
      if (isMain) {
        setFormData((prevData) => ({ ...prevData, main_image: '', main_image_file: null }));
        setPreviewImage('');
      } else {
        const newPreviews = [...secondaryPreviews];
        newPreviews.splice(index, 1);
        if (index < formData.existingSecondaryImages.length) {
          const newExisting = formData.existingSecondaryImages.filter((_, i) => i !== index);
          setFormData((prevData) => ({ ...prevData, existingSecondaryImages: newExisting }));
        } else {
          const adjustedIndex = index - formData.existingSecondaryImages.length;
          const newSecondaryImages = formData.secondary_images.filter((_, i) => i !== adjustedIndex);
          setFormData((prevData) => ({ ...prevData, secondary_images: newSecondaryImages }));
        }
        setSecondaryPreviews(newPreviews);
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
    
      // Validar campos requeridos
      const requiredFields = [
        { name: 'title', value: formData.title },
        { name: 'description', value: formData.description },
        { name: 'address', value: formData.address },
        { name: 'price', value: formData.price },
        { name: 'ubicacion_id', value: formData.ubicacion_id },
        { name: 'status', value: formData.status },
      ];
    
      const invalidFields = requiredFields.filter((field) => {
        const value = field.value != null ? String(field.value) : '';
        console.log(`Validando campo ${field.name}:`, value);
        if (field.name === 'price') {
          const price = Number(value);
          return isNaN(price) || price <= 0 || value === '';
        }
        return value.trim() === '';
      });
    
      if (invalidFields.length > 0) {
        setError(`Los siguientes campos son requeridos o inválidos: ${invalidFields.map((f) => f.name).join(', ')}.`);
        return;
      }
    
      const atributosConValores = {};
      atributos.forEach((atributo) => {
        const value = formData.atributos[atributo.id];
        if (
          (atributo.type === 'boolean' && value === true) ||
          (atributo.type !== 'boolean' && value !== undefined && value !== '' && Number(value) !== 0)
        ) {
          atributosConValores[atributo.id] = atributo.type === 'boolean' ? value : Number(value);
        }
      });
    
      const formDataToSend = new FormData();
      formDataToSend.append('title', String(formData.title).trim());
      formDataToSend.append('description', String(formData.description).trim()); 
      formDataToSend.append('address', String(formData.address).trim());
      formDataToSend.append('price', String(formData.price));
      formDataToSend.append('ubicacion_id', String(formData.ubicacion_id));
      formDataToSend.append('type_id', formData.type_id ? String(formData.type_id) : '');
      formDataToSend.append('status', String(formData.status));
      formDataToSend.append('category_id', formData.category_id ? String(formData.category_id) : '');
    
      // Imágenes
      console.log('main_image:', formData.main_image, 'main_image_file:', formData.main_image_file ? `[File: ${formData.main_image_file.name}]` : null);
      if (formData.main_image && !formData.main_image_file) {
        formDataToSend.append('main_image', formData.main_image);
      }
      if (formData.main_image_file && formData.main_image_file instanceof File) {
        console.log('Añadiendo main_image_file:', formData.main_image_file.name);
        formDataToSend.append('main_image_file', formData.main_image_file);
      } else if (formData.main_image_file) {
        console.warn('main_image_file no es un archivo válido:', formData.main_image_file);
      }
      if (formData.secondary_images && formData.secondary_images.length > 0) {
        formData.secondary_images.forEach((file, index) => {
          if (file instanceof File) {
            formDataToSend.append(`secondary_images[${index}]`, file);
          }
        });
      }
      if (formData.existingSecondaryImages && formData.existingSecondaryImages.length > 0) {
        formData.existingSecondaryImages.forEach((url, index) => {
          formDataToSend.append(`existing_secondary_images[${index}]`, url);
        });
      }
    
      // Atributos
      const atributosArray = Object.keys(atributosConValores).length > 0
        ? Object.entries(atributosConValores).map(([id, value]) => ({ id: Number(id), value }))
        : [];
      atributosArray.forEach((atributo, index) => {
        formDataToSend.append(`atributos[${index}][id]`, atributo.id);
        formDataToSend.append(`atributos[${index}][value]`, atributo.value);
      });
    
      // Relaciones
      if (Array.isArray(formData.owners) && formData.owners.length > 0) {
        formData.owners.forEach((owner, index) => {
          formDataToSend.append(`owners[${index}]`, String(owner));
        });
      }
      if (Array.isArray(formData.tenants) && formData.tenants.length > 0) {
        formData.tenants.forEach((tenant, index) => {
          formDataToSend.append(`tenants[${index}]`, String(tenant));
        });
      }
    
      const formDataEntries = {};
      for (const [key, value] of formDataToSend.entries()) {
        formDataEntries[key] = value instanceof File ? `[File: ${value.name}]` : value;
      }
      console.log('FormData enviado (detallado):', formDataEntries);
      console.log('Inmueble ID:', inmueble?.id);
      console.log('Método:', inmueble?.id ? 'PUT' : 'POST');
    
      onSave(formDataToSend);
    };  

    const handleDelete = async () => {
      if (!inmueble || !inmueble.id) {
        setError('No se puede eliminar un inmueble sin ID.');
        return;
      }

      if (window.confirm(`¿Estás seguro de que deseas eliminar el inmueble "${inmueble.title}"? Esta acción no se puede deshacer.`)) {
        try {
          setLoading(true);
          await deleteInmueble(inmueble.id);
          setError('');
          onDelete(inmueble.id);
          onClose();
        } catch (err) {
          setError('Error al eliminar el inmueble. Revisa la consola para más detalles.');
          console.error('Error al eliminar inmueble:', err.response?.data || err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    const nextStep = () => {
      let isValid = false;
      switch (currentStep) {
        case 1:
          isValid =
            formData.title &&
            formData.description &&
            formData.address &&
            formData.price &&
            formData.ubicacion_id &&
            formData.status &&
            formData.category_id;
          break;
        case 2:
          isValid = formData.main_image_file || formData.main_image;
          if (!isValid) {
            setError('Por favor, suba una imagen principal para el inmueble.');
          }
          break;
        case 3:
          isValid = true;
          break;
        case 4:
          isValid = true;
          break;
        default:
          isValid = true;
      }
      if (isValid) {
        setCurrentStep((prev) => Math.min(prev + 1, 5));
      } else {
        setError('Por favor, complete todos los campos requeridos antes de continuar.');
      }
    };

    const prevStep = () => {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
      setError('');
    };

    const steps = [
      { name: 'Información básica', description: 'Detalles generales del inmueble' },
      { name: 'Imágenes', description: 'Subir imagen principal y secundarias' },
      { name: 'Atributos', description: 'Añadir características del inmueble' },
      { name: 'Relaciones', description: 'Asignar dueños, clientes e inquilinos' },
      { name: 'Confirmación', description: 'Revisar y guardar' },
    ];

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-4xl mx-auto h-[90vh] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h3 className="text-2xl font-bold text-gray-800">
              {inmueble ? 'Editar Inmueble' : 'Agregar Inmueble'}
            </h3>
            {inmueble && (
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={index} className="flex-1 text-center">
                  <div
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep > index + 1
                        ? 'bg-green-500 text-white'
                        : currentStep === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > index + 1 ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700">{step.name}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {loading && <p className="text-gray-500 mb-4 text-center">Cargando...</p>}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <BasicInfoStep
                formData={formData}
                handleChange={handleChange}
                categorias={categorias}
                ubicaciones={ubicaciones}
                tipos={tipos}
              />
            )}
            {currentStep === 2 && (
              <ImagesStep
                formData={formData}
                previewImage={previewImage}
                secondaryPreviews={secondaryPreviews}
                handleFileChange={handleFileChange}
                handleRemoveImage={handleRemoveImage}
              />
            )}
            {currentStep === 3 && (
              <AttributesStep
                atributos={atributos}
                formData={formData}
                handleChange={handleChange}
              />
            )}
            {currentStep === 4 && (
              <RelationshipsStep
                formData={formData}
                handleChange={handleChange}
                clientes={clientes}
              />
            )}
            {currentStep === 5 && (
              <ConfirmationStep
                formData={formData}
                categorias={categorias}
                clientes={clientes}
                atributos={atributos}
                previewImage={previewImage}
                secondaryPreviews={secondaryPreviews}
              />
            )}

            <div className="flex justify-between mt-8">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Anterior
                  </button>
                )}
              </div>
              <div className="flex space-x-4">
                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Siguiente
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={onClose}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Guardar
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  InmuebleModal.propTypes = {
    inmueble: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
  };

  InmuebleModal.defaultProps = {
    inmueble: null,
    onDelete: () => {},
  };

  export default InmuebleModal;