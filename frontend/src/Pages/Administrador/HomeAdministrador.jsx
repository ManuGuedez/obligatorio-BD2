import React from "react";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../../Components/HeaderAdmin";
import Datos from "./Datos";
import Eleccion from "./Eleccion";
import classes from "./HomeAdministrador.module.css";

function HomeAdministrador() {
    const [selected, setSelected] = useState("datos");

    return (
        <div>
            <Header selected={selected} setSelected={setSelected} />
            <div>
                <Routes>
                    <Route path="Datos" element={<Datos />} />
                    <Route path="Eleccion" element={<Eleccion />} />
                    <Route path="" element={<Navigate to="Datos" />} />
                </Routes>
            </div>
        </div>
    );
}

export default HomeAdministrador;