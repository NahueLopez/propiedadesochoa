import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoadScript } from '@react-google-maps/api';

import Home from "./pages/Home";
import Propiedades from "./pages/Propiedades";
import DetallePropiedad from "./pages/DetallePropiedad";
import SobreNosotros from "./pages/SobreNosotros";
import Contacto from "./pages/Contacto";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <Router>
        <div className="min-h-screen pb-14 md:pb-16">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/propiedades" element={<Propiedades />} />
            <Route path="/propiedad/:id" element={<DetallePropiedad />} />
            <Route path="/sobrenosotros" element={<SobreNosotros />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </LoadScript>
  );
};

export default App;