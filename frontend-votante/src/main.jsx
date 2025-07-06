import React, { StrictMode } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { createRoot } from "react-dom/client"
import "bulma/css/bulma.css"
import "./index.css"
import App from "./App.jsx"
import { AccesibilidadProvider } from "./Components/Configuracion/Accesibilidad.jsx"
import { FlujoProvider } from "./Context/FlujoContext.jsx"

createRoot(document.getElementById('root')).render(
  <Router>
    <FlujoProvider>
      <AccesibilidadProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </AccesibilidadProvider>
    </FlujoProvider>
  </Router>
);