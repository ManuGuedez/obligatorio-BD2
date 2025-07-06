import React, { useRef, useState } from "react";
import { useAccesibilidad } from "../../Components/Configuracion/Accesibilidad";
import classes from "./Consulta.module.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useFlujo } from "../../Context/FlujoContext";
import ConsultaCard from "../../Components/Cards/Consulta";

function VotacionConsulta() {
    const { modoOscuro, letraGrande, altoContraste } = useAccesibilidad();
    const [selectedItem, setSelectedItem] = useState(null);
    const { etapa, guardarVoto, siguiente } = useFlujo();
    const navigate = useNavigate();
    const iconRef = useRef(null);

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
    };

    const handleSiguienteClick = () => {
        guardarVoto({
            descripcion: etapa.descripcion,
            respuesta: selectedItem
        });

        if (selectedItem === "votoAnulado") {
            navigate("/resumen");
        } else {
            const next = siguiente();
            if (next?.tipo) {
                setSelectedItem(null);
                navigate(`/votacion/${next.tipo}`);
            } else {
                navigate("/resumen");
            }
        }
    };

    const isActive = (item) => selectedItem === item ? classes.seleccionado : "";

    const containerClasses = `${classes.presidencialContainer} ${modoOscuro ? classes.modoOscuro : ""} ${letraGrande ? classes.letraGrande : ""} ${altoContraste ? classes.altoContraste : ""}`;
    return (
        <div className={containerClasses}>
            <div className={classes.header}>
                <div className={classes.spacer} />
                <div className={classes.headerTitle}>
                <p className="title is-2 has-text-white mr-4">{etapa.descripcion}</p>
                </div>
                <div className={classes.headerIcon} onClick={handleConfigClick}>
                <FontAwesomeIcon icon={faGear} size="3x" color="white" ref={iconRef} />
                </div>
            </div>

            <div className={classes.content}>
                <ConsultaCard
                    descripcion={etapa.descripcion}
                    color={etapa.color}
                    isSelected={selectedItem === "votoLista"}
                    onClick={() => handleItemClick("votoLista")}
                />

                <div className={classes.otrosVotos}>
                <div
                    className={`${classes.votoBlanco} ${isActive("votoBlanco")}`}
                    onClick={() => handleItemClick("votoBlanco")}
                >
                    <p className="title is-2">Voto en Blanco</p>
                </div>
                <div
                    className={`${classes.votoAnulado} ${isActive("votoAnulado")}`}
                    onClick={() => handleItemClick("votoAnulado")}
                >
                    <p className="title is-2">Voto Anulado</p>
                </div>
                </div>
            </div>

            <div className={classes.footer}>
                <button
                className="button has-background-grey-lighter is-large is-rounded"
                onClick={() => navigate(-1)}
                >
                <strong>Atrás</strong>
                </button>
                <button
                className="button has-background-grey-lighter is-large is-rounded"
                onClick={handleSiguienteClick}
                disabled={!selectedItem}
                >
                <strong>Siguiente</strong>
                </button>
            </div>
        </div>
    );
}

export default VotacionConsulta;