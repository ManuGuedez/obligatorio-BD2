import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bulma/css/bulma.css"; 
import Inicio from "./Pages/Inicio";
import Configuracion from "./Components/Configuracion/Configuracion";
import VotacionPorLista from "./Pages/Votación/PorLista";
import SeleccionLista from "./Pages/Votación/SeleccionLista";
import VotacionConsulta from "./Pages/Votación/Consulta";
// import VotacionMunicipal from "./pages/VotacionMunicipal";
// import VotacionReferendum from "./pages/VotacionReferendum";
// import VotacionPlebiscito from "./pages/VotacionPlebiscito";
// import VotacionBallotage from "./pages/VotacionBallotage";
import Resumen from "./Pages/Resumen";
// import ConfirmacionVoto from "./pages/ConfirmacionVoto";
// import FinVoto from "./pages/FinVoto";

export const url = "http://localhost:5001"; // URL del backend

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

      {/*

      <Route path="/confirmacion" element={<ConfirmacionVoto />} />
      <Route path="/fin" element={<FinVoto />} />
      <Route path="*" element={<Navigate to="/inicio" />} />
      */}
    </Routes>
  );
}

export default App;