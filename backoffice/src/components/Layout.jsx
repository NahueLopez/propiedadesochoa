import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
                to="/atributos"
                className={({ isActive }) =>
                  `flex items-center p-4 hover:bg-gray-700 ${
                    isActive ? 'bg-blue-600' : ''
                  }`
                }
              >
                <span className="text-xl min-w-[30px] text-center">⚙️</span>
                {isSidebarOpen && <span className="ml-4">Atributos</span>}
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
          <button className="text-gray-600 hover:text-gray-800">
            Cerrar Sesión
          </button>
        </header>
        <main className="bg-white p-6 rounded-lg shadow min-h-[calc(100vh-120px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;