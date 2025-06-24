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
        }
    }, [location.pathname, setSelected]);

    const handleClick = (value) => {
        setSelected(value);
        navigate(`/HomeAdministrador/${value === "datos" ? "Datos" : "Eleccion"}`);
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
                    className={`button is-rounded is-large px-6 has-text-link has-text-weight-semibold ${
                        selected === "datos" ? "is-info" : "is-success"
                    }`}
                    onClick={() => handleClick("datos")}
                >
                    Gestión de datos
                </button>
                <button
                    className={`button is-rounded is-large px-6 has-text-link has-text-weight-semibold ${
                        selected === "eleccion" ? "is-info" : "is-success"
                    }`}
                    onClick={() => handleClick("eleccion")}
                >
                    Elección
                </button>
            </div>
        </div>
    );
}

export default Header;