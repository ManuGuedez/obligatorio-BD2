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
  const [selectedItem, setSelectedItem] = useState(null);
  const [listas, setListas] = useState([]);
  const { etapa, guardarVoto, siguiente } = useFlujo();
  const tipo = etapa.tipo;

  const { modoOscuro, letraGrande, altoContraste } = useAccesibilidad();
  const navigate = useNavigate();
  const iconRef = useRef(null);

  // GET listas desde backend real
  useEffect(() => {
    const getListas = async () => {
      const data = await votarService.getListas();

      const agrupadas = {};

      data.forEach((l) => {
        const partido = l.partido || "Otro";
        if (!agrupadas[partido]) {
          agrupadas[partido] = {
            partido,
            color: "#4a5568", // Color por defecto
            listas: [],
          };
        }

        agrupadas[partido].listas.push({
          id: l.id_papeleta,
          nro: l.nro,
          candidato: `${l.nombre_candidato} ${l.apellido_candidato}`,
        });
      });

      const resultado = Object.values(agrupadas);
      setListas(resultado);
    };

    getListas();
  }, []);

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

  const handleItemClick = (id) => {
    setSelectedItem(id);
  };

  const handleSiguienteClick = () => {
    const listaElegida = listas
      .flatMap((partido) =>
        partido.listas?.map((l) => ({ ...l, partido: partido.partido }))
      )
      .find((l) => l.id === selectedItem);

    if (listaElegida) {
      guardarVoto({
        nro: listaElegida.nro,
        candidato: listaElegida.candidato,
        partido: listaElegida.partido,
      });
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
        {listas.map((partido) => (
          <div key={partido.partido} className="mb-5 px-5">
            <h2 className="subtitle is-3 has-text-weight-bold">
              {partido.partido}
            </h2>
            <div className={classes.fixedColumns}>
              <div className={classes.column}>
                {partido.listas.slice(0, 4).map((lista) => (
                  <div key={lista.id} className={classes.cardWrapper}>
                    <ListaCard
                      lista={{
                        ...lista,
                        nombre: `Lista #${lista.nro} - ${lista.candidato}`,
                      }}
                      partidoColor={partido.color}
                      isSelected={selectedItem === lista.id}
                      onClick={handleItemClick}
                    />
                  </div>
                ))}
              </div>
              <div className={classes.column}>
                {partido.listas.slice(4).map((lista) => (
                  <div key={lista.id} className={classes.cardWrapper}>
                    <ListaCard
                      lista={{
                        ...lista,
                        nombre: `Lista #${lista.nro} - ${lista.candidato}`,
                      }}
                      partidoColor={partido.color}
                      isSelected={selectedItem === lista.id}
                      onClick={handleItemClick}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
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
