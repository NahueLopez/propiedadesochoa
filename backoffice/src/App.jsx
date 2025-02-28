import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Inmuebles from "./pages/Inmuebles";
import Atributos from "./pages/Atributos";
import Layout from "./components/Sidebar";
import Clientes from "./pages/Clientes";
import Contratos from "./pages/Contratos";
import Categorias from "./pages/Categorias";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta del Login sin Layout */}
        <Route path="/" element={<Login />} />
        
        {/* Rutas con tu Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/inmuebles" element={<Inmuebles />} />
          <Route path="/atributos" element={<Atributos />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/contratos" element={<Contratos />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;