import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Propiedades from "./pages/Propiedades";
import DetallePropiedad from "./pages/DetallePropiedad";
import SobreNosotros from "./pages/SobreNosotros";
import Contacto from "./pages/Contacto";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/propiedades" element={<Propiedades />} />
        <Route path="/propiedades/:id" element={<DetallePropiedad />} />
        <Route path="/sobrenosotros" element={<SobreNosotros />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;
