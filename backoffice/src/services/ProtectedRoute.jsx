import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Asegúrate de instalarlo: npm install axios

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null para indicar carga
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const location = useLocation();

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                // Usa la variable de entorno para la URL base
                const baseUrl = import.meta.env.VITE_URL_BACK || 'http://localhost:8000'; // Reemplaza con la URL de producción si está configurada

                // Usa una ruta protegida existente para validar el token (por ejemplo, /user)
                await axios.get(`${baseUrl}/api/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIsAuthenticated(true); // Token válido
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token'); // Elimina token vencido
                }
                setIsAuthenticated(false); // Token inválido
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [token]);

    // Mientras se valida el token, muestra un estado de carga
    if (loading) {
        return <div>Cargando...</div>; // O un spinner
    }

    // Si no está autenticado (token inválido o no existe), redirige al login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si está autenticado, renderiza los children
    return children;
};

export default ProtectedRoute;
