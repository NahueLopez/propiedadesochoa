import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Inmuebles from "./pages/Inmuebles";
import Atributos from "./pages/Atributos";
import Clientes from "./pages/Clientes";
import Contratos from "./pages/Contratos";
import Categorias from "./pages/Categorias";
import Tipos from "./pages/Tipos";
import Usuarios from "./pages/Usuarios";

import Layout from "./components/Layout";
import ProtectedRoute from "./services/ProtectedRoute";
import Ubicaciones from "./pages/Ubicaciones";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Ruta del Login sin Layout (pública) */}
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Login />} /> {/* Redirige raíz a login */}

                {/* Rutas protegidas con Layout */}
                <Route element={<Layout />}>
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/inmuebles"
                        element={
                            <ProtectedRoute>
                                <Inmuebles />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/atributos"
                        element={
                            <ProtectedRoute>
                                <Atributos />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/categorias"
                        element={
                            <ProtectedRoute>
                                <Categorias />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/clientes"
                        element={
                            <ProtectedRoute>
                                <Clientes />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/contratos"
                        element={
                            <ProtectedRoute>
                                <Contratos />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tipos"
                        element={
                            <ProtectedRoute>
                                <Tipos />
                            </ProtectedRoute>
                        }
                    />
                      <Route
                        path="/ubicaciones"
                        element={
                            <ProtectedRoute>
                                <Ubicaciones />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/usuarios"
                        element={
                            <ProtectedRoute>
                                <Usuarios />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;