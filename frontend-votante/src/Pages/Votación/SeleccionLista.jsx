import React, { useRef, useEffect, useState } from "react";
import { useAccesibilidad } from "../../Components/Configuracion/Accesibilidad";
import classes from "./SeleccionLista.module.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import ListaCard from "../../Components/Cards/Lista";
import { useFlujo } from "../../Context/FlujoContext";
import votarService from "../../Services/votarService";

function SeleccionLista() {
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [listas, setListas] = useState([]);
  const { etapa, guardarVoto, siguiente } = useFlujo();
  const tipo = etapa.tipo;

  const { modoOscuro, letraGrande, altoContraste } = useAccesibilidad();
  const navigate = useNavigate();
  const iconRef = useRef(null);

  // GET listas desde backend real
  useEffect(() => {
    const getListas = async () => {
      let listass = await votarService.getListas();
      setListas(listass);
    };
    getListas();
  }, []);

  useEffect(() => {
    console.log("LISTAAASSSS: ", listas);
  }, [listas]);

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
          { id: 9, nro: "105", candidato: "Diego Sánchez" },
        ],
      },
      {
        partido: "Partido Verde",
        color: "#065f46",
        listas: [{ id: 3, nro: "200", candidato: "Carlos Rodríguez" }],
      },
      {
        partido: "Partido Rojo",
        color: "#b91c1c",
        listas: [
          { id: 4, nro: "300", candidato: "Ana Torres" },
          { id: 5, nro: "301", candidato: "Marta Silva" },
        ],
      },
    ],
    municipal: [
      {
        partido: "Partido Municipal",
        color: "#4a5568",
        listas: [
          { id: 10, nro: "400", candidato: "Roberto Díaz" },
          { id: 11, nro: "401", candidato: "Clara Ruiz" },
        ],
      },
      {
        partido: "Partido Local",
        color: "#2c5282",
        listas: [{ id: 12, nro: "500", candidato: "Fernando Castro" }],
      },
    ],
  };

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

  const handleItemClick = (id, lista) => {
    setSelectedItem(id);
    localStorage.setItem("id_papeleta", id);
  };

  const handleSiguienteClick = () => {
    const listaElegida = listas.find((l) => l.id_papeleta === selectedItem);
    console.log("elegidal", listaElegida)

    if (listaElegida) {
      guardarVoto({
        tipo: "municipal", // tipo actual (presidencial, municipal, etc.)
        opcion: {
          id_papeleta: listaElegida.id_papeleta, // asumimos que el campo id es el ID de la papeleta
          nro: listaElegida.nro,
          candidato: listaElegida.nombre_candidato + " " + listaElegida.apellido_candidato,
          partido: listaElegida.partido,
        },
      });
      console.log("imprimee",{
          id_papeleta: listaElegida.id_papeleta, // asumimos que el campo id es el ID de la papeleta
          nro: listaElegida.nro,
          candidato: listaElegida.nombre_candidato + " " + listaElegida.apellido_candidato,
          partido: listaElegida.partido,
        })
    }

    const nextStep = siguiente();
    if (!nextStep || nextStep.tipo === "resumen") {
      navigate("/resumen");
    } else {
      navigate(`/votacion/${nextStep.tipo}`, {
        state: nextStep,
      });
    }
  };

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
            color="white"
            ref={iconRef}
          />
        </div>
      </div>

      <div className="section" style={{ width: "100%" }}>
        {listas &&
          listas?.map((lista) => (
            <ListaCard
              key={lista.id_papeleta}
              lista={lista}
              partidoColor={"fffff"}
              isSelected={selectedItem === lista.id}
              onClick={handleItemClick}
            />
          ))}
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

export default SeleccionLista;
