import React, { useRef, useState } from "react";
import { useAccesibilidad } from "../../Components/Configuracion/Accesibilidad";
import classes from "./PorLista.module.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useFlujo } from "../../Context/FlujoContext";

function VotacionPorLista() {
  const { modoOscuro, letraGrande, altoContraste } = useAccesibilidad();
  const [selectedItem, setSelectedItem] = useState(null);
  const { etapa, guardarVoto, anterior, siguiente } = useFlujo();
  const tipo = etapa.tipo;
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
    if (selectedItem === "votoLista") {
      navigate(`/votacion/${tipo}/listas`, { state: { tipo } });
    } else if (selectedItem === "votoAnulado") {
      guardarVoto({
        tipo: etapa.tipo,
        opcion: {
          respuesta: selectedItem,
          id_papeleta: 999, // id hardcode de voto anulado
        },
      });
      navigate("/resumen");
    }
    if (selectedItem === "votoBlanco") {
      guardarVoto({
        tipo: etapa.tipo,
        opcion: {
          respuesta: selectedItem,
          id_papeleta: 998, // id hardcode de voto en blanco
        },
      });
      const nextStep = siguiente();
      if (!nextStep || nextStep.tipo === "resumen") {
        navigate("/resumen");
      } else {
        navigate(`/votacion/${nextStep.tipo}`, {
          state: nextStep,
        });
      }
    }
  };

  const isActive = (item) =>
    selectedItem === item ? classes.seleccionado : "";

  // Aplicar clases de accesibilidad al contenedor
  const containerClasses = `${classes.presidencialContainer} ${
    modoOscuro ? classes.modoOscuro : ""
  } ${letraGrande ? classes.letraGrande : ""} ${
    altoContraste ? classes.altoContraste : ""
  }`;

  return (
    <div className={containerClasses}>
      <div className={classes.header}>
        <div className={classes.spacer} />
        <div className={classes.headerTitle}>
          <p className="title is-1 has-text-white">
            Votación {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </p>
        </div>
        <div className={classes.headerIcon} onClick={handleConfigClick}>
          <FontAwesomeIcon
            icon={faGear}
            size="3x"
            style={{ color: "#ffffff", alignSelf: "flex-end" }}
            ref={iconRef}
          />
        </div>
      </div>
      <div className={classes.content}>
        <div
          className={`${classes.votoLista} ${isActive("votoLista")}`}
          onClick={() => handleItemClick("votoLista")}
        >
          <p className="title is-1">
            Voto a<br /> una Lista
          </p>
        </div>
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
          onClick={() => {
            const prevStep = anterior();
            navigate(`${prevStep.tipo}`, { state: prevStep });
          }}
          disabled
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

export default VotacionPorLista;
