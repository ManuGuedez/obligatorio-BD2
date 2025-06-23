import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bulma/css/bulma.css";
import { AccesibilidadProvider } from "./Components/Configuracion/Accesibilidad.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <AccesibilidadProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </AccesibilidadProvider>
  </Router>
);
