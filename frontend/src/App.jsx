import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login/Login";
import HomeMiembroMesa from "./Pages/MiembroMesa/HomeMiembroMesa";
import HomeAdministrador from "./Pages/Administrador/HomeAdministrador";
import Estadisticas from "./Components/Estadisticas/Estadisticas";
import Configuracion from "./Components/Configuracion/Configuracion";
import './global.css';

export const url = "http://localhost:5001";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/Login" />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/HomeMiembroMesa" element={<HomeMiembroMesa />} />
            <Route path="/HomeAdministrador/*" element={<HomeAdministrador />} />
           <Route path="/Estadisticas" element={<Estadisticas />} />
           <Route path="/Configuracion" element={<Configuracion />} />

        </Routes>
    )
}

export default App;
