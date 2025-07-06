import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bulma/css/bulma.css"; 
import Inicio from "./Pages/Inicio";
import Configuracion from "./Components/Configuracion/Configuracion";
import VotacionPorLista from "./Pages/Votación/PorLista";
import SeleccionLista from "./Pages/Votación/SeleccionLista";
import VotacionConsulta from "./Pages/Votación/Consulta";
import Resumen from "./Pages/Resumen";
import Confirmacion from "./Pages/Confirmacion";

export const url = "http://localhost:5000"; // URL del backend

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inicio" />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/configuracion" element={<Configuracion />} />
      <Route path="/votacion/:tipo" element={<VotacionPorLista />} />
      <Route path="/votacion/:tipo/listas" element={<SeleccionLista />} />
      <Route path="/votacion/consulta" element={<VotacionConsulta />} />
      <Route path="/resumen" element={<Resumen />} />
      <Route path="/confirmacion" element={<Confirmacion />} />
      <Route path="*" element={<Navigate to="/inicio" />} />
    </Routes>
  );
}

export default App;