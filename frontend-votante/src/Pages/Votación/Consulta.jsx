import React, { useRef, useState } from "react";
import { useAccesibilidad } from "../../Components/Configuracion/Accesibilidad";
import classes from "./Presidencial.module.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useVoto } from "../../Context/VotoContext";

function VotacionConsulta() {
    const { modoOscuro, letraGrande, altoContraste } = useAccesibilidad();
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();
    const iconRef = useRef(null);
    const { setVoto } = useVoto();

    const handleConfigClick = () => {
        if (iconRef.current) {
        iconRef.current.classList.add("fa-spin");

            setTimeout(() => {
                iconRef.current.classList.remove("fa-spin");
                navigate("/configuracion");
            }, 500);
        }
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
    }

    const handleSiguienteClick = () => {
        setVoto(selectedItem);
        if (selectedItem === "votoLista") {
            navigate("/votacion/presidencial/listas", { state: { tipo: "presidencial" } });
        }
    }
    
    const isActive = (item) => selectedItem === item ? classes.seleccionado : "";

    // Aplicar clases de accesibilidad al contenedor
    const containerClasses = `${classes.presidencialContainer} ${modoOscuro ? classes.modoOscuro : ""} ${letraGrande ? classes.letraGrande : ""} ${altoContraste ? classes.altoContraste : ""}`;

    return (
        <div className={containerClasses}>
            <div className={classes.header}>
                <div className={classes.spacer} />
                <div className={classes.headerTitle}>
                    <p className="title is-1 has-text-white">Votación Consulta</p>
                </div>
                <div className={classes.headerIcon} onClick={handleConfigClick}>
                    <FontAwesomeIcon icon={faGear} size="3x" style={{color: "#ffffff", alignSelf: "flex-end"}} ref={iconRef}/>
                </div>
            </div>
            <div className={classes.content}>
                <div className={`${classes.votoLista} ${isActive("votoLista")}`} onClick={() => handleItemClick("votoLista")}>
                    <p className="title is-1">Sí</p>
                </div>
                <div className={classes.otrosVotos}>
                    <div className={`${classes.votoBlanco} ${isActive("votoBlanco")}`} onClick={() => handleItemClick("votoBlanco")}>
                        <p className="title is-2">Voto en Blanco</p>
                    </div>
                    <div className={`${classes.votoAnulado} ${isActive("votoAnulado")}`} onClick={() => handleItemClick("votoAnulado")}>
                        <p className="title is-2">Voto Anulado</p>
                    </div>
                </div>
            </div>

            <div className={classes.footer}>
                <button className="button has-background-grey-lighter is-large is-rounded" onClick={() => navigate(-1)}>
                    <strong>Atrás</strong>
                </button>
                <button className="button has-background-grey-lighter is-large is-rounded" onClick={handleSiguienteClick} disabled={!selectedItem}>
                    <strong>Siguiente</strong>
                </button>
            </div>
        </div>
    );
}

export default VotacionConsulta;