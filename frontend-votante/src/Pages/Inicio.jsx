import React, { useEffect } from "react";
import classes from "./Inicio.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowRight, faGear } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {useFlujo} from "../Context/FlujoContext";

function Inicio() {
    const navigate = useNavigate();
    const { siguiente } = useFlujo();

    const handleConfigClick = () => {
        const configIcon = document.querySelector(`.${classes.inicioContainer} .fa-gear`);
        if (configIcon) {
            configIcon.classList.add("fa-spin");
        }
        setTimeout(() => {
            navigate("/configuracion");
        }, 500);
    }

    const { reset, etapa } = useFlujo();

    useEffect(() => {
        reset();
    }, []);

    const handleInicioClick = () => {
        const nextStep = siguiente();
        navigate(`/votacion/${nextStep.tipo}`, {
            state: { id: nextStep.id }
        });
    }

    return (
        <div className={classes.inicioContainer}>
            <FontAwesomeIcon icon={faGear} size="3x" style={{color: "#495e92", alignSelf: "flex-end"}} onClick={handleConfigClick}/>
            <img
                src="../../../public/Escudo20Uruguay_19.png"
                alt="Logo"
                className={classes.logo}
            />
            <p className={`title is-1 has-text-link mt-2 ${classes.titulo}`}>Bienvenido al sistema de votación electrónico</p>
            <p className="has-text-weight-semibold is-size-4" style={{ textAlign: "center" }}>
                Presionando la
                <FontAwesomeIcon icon={faGear} size="1x" style={{color: "#495e92", margin: "0px 10px" }} />
                puede acceder a configuraciones de accesibilidad
            </p>
            <button className={`button is-link is-rounded pl-6 ${classes.button}`} onClick={handleInicioClick}>
                <p className={classes.inicioText}>Iniciar</p>
                <FontAwesomeIcon icon={faCircleArrowRight} size="10x" style={{color: "#ffffff"}} />
            </button>
        </div>
    );
}

export default Inicio;