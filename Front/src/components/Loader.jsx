import React from "react";

function Loader({ message = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-500"></div>
      <p className="mt-4 text-gray-300 text-lg">{message}</p>
    </div>
  );
}

export default Loader;  