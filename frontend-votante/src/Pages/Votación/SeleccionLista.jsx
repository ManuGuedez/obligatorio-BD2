import React, { useRef } from "react";
import { useAccesibilidad } from "../../Components/Configuracion/Accesibilidad";
import classes from "./SeleccionLista.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

function SeleccionLista() {
    const location = useLocation();
    const tipo = location.state?.tipo || "presidencial";
    const [selectedItem, setSelectedItem] = React.useState(null);

    const listasPorTipo = {
        presidencial: [
        {
            partido: "Partido Azul",
            color: "#1e40af",
            listas: [
            { id: 1, nro: "100", candidato: "Juan Pérez" },
            { id: 2, nro: "101", candidato: "Laura Gómez" },
            { id: 6, nro: "102", candidato: "Pedro Fernández" },
            { id: 7, nro: "103", candidato: "Lucía Martínez" },
            { id: 8, nro: "104", candidato: "Sofía López" },
            { id: 9, nro: "105", candidato: "Diego Sánchez" }
            ]
        },
        {
            partido: "Partido Verde",
            color: "#065f46",
            listas: [
            { id: 3, nro: "200", candidato: "Carlos Rodríguez" }
            ]
        },
        {
            partido: "Partido Rojo",
            color: "#b91c1c",
            listas: [
            { id: 4, nro: "300", candidato: "Ana Torres" },
            { id: 5, nro: "301", candidato: "Marta Silva" }
            ]
        }
        ]
    };

    const listas = listasPorTipo[tipo] || [];

    const { modoOscuro, letraGrande, altoContraste } = useAccesibilidad();
    const navigate = useNavigate();
    const iconRef = useRef(null);

    const containerClasses = `
        ${classes.listasContainer} 
        ${modoOscuro ? classes.modoOscuro : ""} 
        ${letraGrande ? classes.letraGrande : ""} 
        ${altoContraste ? classes.altoContraste : ""}
    `;

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
        if (selectedItem) {
            navigate("/votacion/consulta");
        }
    }

    const isActive = (item) => selectedItem === item ? classes.seleccionado : "";


    return (
        <div className={containerClasses}>
            <div className={classes.header}>
                <div className={classes.spacer} />
                <div className={classes.headerTitle}>
                <p className="title is-1 has-text-white">Votación {tipo}</p>
                </div>
                <div className={classes.headerIcon} onClick={handleConfigClick}>
                <FontAwesomeIcon icon={faGear} size="3x" color="white" ref={iconRef} />
                </div>
            </div>

            <div className="section" style={{ width: "100%" }}>
                {listas.map((partido) => (
                <div key={partido.partido} className="mb-5 px-5">
                    <h2 className="subtitle is-3 has-text-weight-bold">{partido.partido}</h2>
                    <div className="columns is-multiline">
                    {partido.listas.map((lista) => {
                    const textClass = getTextClass(partido.color);
                    return (
                        <div className="column is-4" key={lista.id}>
                        <div
                            className={`card ${isActive(lista.id)}`}
                            style={{
                            backgroundColor: partido.color,
                            borderRadius: "12px",
                            cursor: "pointer"
                            }}
                            onClick={() => handleItemClick(lista.id)}
                        >
                            <div className={`card-content ${textClass}`}>
                            <p className={`title is-4 mb-2 ${textClass}`}>
                                Lista {lista.nro}
                            </p>
                            <p className={`subtitle is-6 ${textClass}`}>
                                {lista.candidato}
                            </p>
                            </div>
                        </div>
                        </div>
                    );
                    })}
                    </div>
                </div>
                ))}
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

    function getTextClass(hexcolor) {
        hexcolor = hexcolor.replace("#", "");
        const r = parseInt(hexcolor.substr(0, 2), 16);
        const g = parseInt(hexcolor.substr(2, 2), 16);
        const b = parseInt(hexcolor.substr(4, 2), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? "has-text-black" : "has-text-white";
    }
}

export default SeleccionLista;