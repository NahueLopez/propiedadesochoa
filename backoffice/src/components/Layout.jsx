import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Estado para el modal
  const navigate = useNavigate(); // Hook para redirigir

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true); // Abrir el modal
  };

  const handleConfirmLogout = () => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token'); // Ajustado a la clave 'token'
    navigate('/login'); // Redirigir a la página de login
    setIsLogoutModalOpen(false); // Cerrar el modal
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false); // Cerrar el modal sin hacer nada
  };

  return (
    <div className="flex min-h-screen">
      <aside
        className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex items-center p-4">
          <button
            className="text-white text-2xl p-2 hover:bg-gray-700 rounded"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? '✕' : '☰'}
          </button>
          {isSidebarOpen && (
            <h2 className="text-lg font-semibold">Panel Inmobiliario</h2>
          )}
        </div>

        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `flex items-center p-4 hover:bg-gray-700 ${
                    isActive ? 'bg-blue-600' : ''
                  }`
                }
              >
                <span className="text-xl min-w-[30px] text-center">🏠</span>
                {isSidebarOpen && <span className="ml-4">Dashboard</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/inmuebles"
                className={({ isActive }) =>
                  `flex items-center p-4 hover:bg-gray-700 ${
                    isActive ? 'bg-blue-600' : ''
                  }`
                }
              >
                <span className="text-xl min-w-[30px] text-center">🏢</span>
                {isSidebarOpen && <span className="ml-4">Inmuebles</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/categorias"
                className={({ isActive }) =>
                  `flex items-center p-4 hover:bg-gray-700 ${
                    isActive ? 'bg-blue-600' : ''
                  }`
                }
              >
                <span className="text-xl min-w-[30px] text-center">📑</span>
                {isSidebarOpen && <span className="ml-4">Categorías</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tipos"
                className={({ isActive }) =>
                  `flex items-center p-4 hover:bg-gray-700 ${
                    isActive ? 'bg-blue-600' : ''
                  }`
                }
              >
                <span className="text-xl min-w-[30px] text-center">🏷️</span>
                {isSidebarOpen && <span className="ml-4">Tipos</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/atributos"
                className={({ isActive }) =>
                  `flex items-center p-4 hover:bg-gray-700 ${
                    isActive ? 'bg-blue-600' : ''
                  }`
                }
              >
                <span className="text-xl min-w-[30px] text-center">🔹</span>
                {isSidebarOpen && <span className="ml-4">Atributos</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/ubicaciones"
                className={({ isActive }) =>
                  `flex items-center p-4 hover:bg-gray-700 ${
                    isActive ? 'bg-blue-600' : ''
                  }`
                }
              >
                <span className="text-xl min-w-[30px] text-center">🗺️</span>
                {isSidebarOpen && <span className="ml-4">Ubicaciones</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/clientes"
                className={({ isActive }) =>
                  `flex items-center p-4 hover:bg-gray-700 ${
                    isActive ? 'bg-blue-600' : ''
                  }`
                }
              >
                <span className="text-xl min-w-[30px] text-center">👥</span>
                {isSidebarOpen && <span className="ml-4">Clientes</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/usuarios"
                className={({ isActive }) =>
                  `flex items-center p-4 hover:bg-gray-700 ${
                    isActive ? 'bg-blue-600' : ''
                  }`
                }
              >
                <span className="text-xl min-w-[30px] text-center">👤</span>
                {isSidebarOpen && <span className="ml-4">Usuarios</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contratos"
                className={({ isActive }) =>
                  `flex items-center p-4 hover:bg-gray-700 ${
                    isActive ? 'bg-blue-600' : ''
                  }`
                }
              >
                <span className="text-xl min-w-[30px] text-center">📝</span>
                {isSidebarOpen && <span className="ml-4">Contratos</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 p-6 bg-gray-100">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bienvenido, Admin</h1>
          <button
            className="text-gray-600 hover:text-gray-800 hover:cursor-pointer"
            onClick={handleLogoutClick}
          >
            Cerrar Sesión
          </button>
        </header>
        <main className="bg-white p-6 rounded-lg shadow min-h-[calc(100vh-120px)]">
          <Outlet />
        </main>

        {/* Modal de confirmación */}
        {isLogoutModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <h3 className="text-lg font-semibold mb-4">Confirmar Cerrar Sesión</h3>
              <p className="mb-4">¿Estás seguro de que deseas cerrar sesión?</p>
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  onClick={handleCancelLogout}
                >
                  Cancelar
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={handleConfirmLogout}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Layout;