import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {useState, useEffect} from "react";
import classes from "./HeaderAdmin.module.css";

function Header({ selected, setSelected }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("Eleccion")) {
            setSelected("eleccion");
        } else if (location.pathname.includes("Datos")) {
            setSelected("datos");
        } else if (location.pathname.includes("Estadisticas")) {
            setSelected("estadisticas");
        } else {
            setSelected("datos");
        }
    }, [location.pathname, setSelected]);

    const handleClick = (value) => {
        setSelected(value);
        if (value === "datos") {
            navigate("/HomeAdministrador/Datos");
        } else if (value === "eleccion") {
            navigate("/HomeAdministrador/Eleccion");
        } else if (value === "estadisticas") {
            navigate("/HomeAdministrador/Estadisticas");
        }
    };

    return (
        <div className={classes.header}>
            <img
                src="../../../public/Escudo20Uruguay_19.png"
                alt="Logo"
                className={classes.logo}
                draggable="false"
            />
            <div className={classes.headerButtonContainer}>
                <button
                    className={`button is-rounded is-medium has-text-link has-text-weight-semibold ${
                        selected === "datos" ? "is-info" : "is-success"
                    }`}
                    onClick={() => handleClick("datos")}
                >
                    Gestión de datos
                </button>
                <button
                    className={`button is-rounded is-medium has-text-link has-text-weight-semibold ${
                        selected === "eleccion" ? "is-info" : "is-success"
                    }`}
                    onClick={() => handleClick("eleccion")}
                >
                    Elección
                </button>
                <button
                    className={`button is-rounded is-medium has-text-link has-text-weight-semibold ${
                        selected === "estadisticas" ? "is-info" : "is-success"
                    }`}
                    onClick={() => handleClick("estadisticas")}
                >
                    Estadísticas
                </button>
            </div>
        </div>
    );
}

export default Header;