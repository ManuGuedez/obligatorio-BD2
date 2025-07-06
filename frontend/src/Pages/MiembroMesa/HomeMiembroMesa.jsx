import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./HomeMiembroMesa.module.css";
import PersonaModal from "../../Components/Modals/Informacion/PersonaModal";
import ConfirmarCierreModal from "../../Components/Modals/ConfirmarCierreMesa/ConfirmarCierreModal";
import EsperandoVoto from "./EsperandoVoto";
import { FaUser, FaSearch } from "react-icons/fa";
import escudo from "../../../public/Escudo20Uruguay_19.png";
import useSocket from "../../hooks/useSocket";
import miembroService from "../../services/miembroServices";

function HomeMiembroMesa() {
  const [circuitoAbierto, setCircuitoAbierto] = useState(() => {
    return localStorage.getItem("circuitoAbierto") === "true";
  });
  const [tiempoRestante, setTiempoRestante] = useState(10 * 60 * 60); // 10 horas en segundos
  const [votantes, setVotantes] = useState([]);
  const [observadoMarcado, setObservadoMarcado] = useState(false);

  const toggleObservado = () => {
    setObservadoMarcado((prev) => !prev);

    // También actualizás el votante para que se refleje la selección/desselección
    const actualizados = votantes.map((v) =>
      v.ci === persona.ci
        ? { ...v, tipoVoto: !observadoMarcado ? "observado" : null }
        : v
    );
    setVotantes(actualizados);
  };

  useEffect(() => {
    const fetchVotantes = async () => {
      try {
        const token = localStorage.getItem("token");
        const ciudadanos = await miembroService.getCiudadanos(token);
        setVotantes([...ciudadanos]);
        console.log("Ciudadanos traídos:", [...ciudadanos]);
      } catch (error) {
        console.error("Error al traer los ciudadanos:", error);
      }
    };

    fetchVotantes();
  }, []);

  // Socket para recibir actualizaciones en tiempo real
  useSocket({
    onVotanteHabilitado: ({ ciCiudadano }) => {
      setVotantes((prev) =>
        prev.map((v) => (v.ci === ciCiudadano ? { ...v, habilitado: true } : v))
      );
    },
    onVotoEmitido: (data) => {
      console.log("Voto emitido para CI:", data.ci_ciudadano);
      setVotantes((prev) =>
        prev.map((v) =>
          v.ci === data.ci_ciudadano ? { ...v, yaVoto: true } : v
        )
      );



      setEsperandoVoto(false);
      setPersona(null);
    },
  });

  const [persona, setPersona] = useState(null);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [esperandoVoto, setEsperandoVoto] = useState(false);
  const navigate = useNavigate();

  const handleAbrirCircuito = () => {
    setCircuitoAbierto(true);
  };

  const handleSeleccionarPersona = (v) => {
    setPersona(v);
    setIsPersonaOpen(true);
  };

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    setCircuitoAbierto(false);
    navigate("/Estadisticas");
  };

  const handleVotar = () => {
    const actualizados = votantes.map((v) =>
      v.ci === persona.ci ? { ...v, voto: true } : v
    );
    setVotantes(actualizados);
    setPersona({ ...persona, voto: true });
  };

  const formatoTiempo = (segundos) => {
    const hrs = Math.floor(segundos / 3600);
    const mins = Math.floor((segundos % 3600) / 60);
    return `${hrs}hrs ${mins.toString().padStart(2, "0")}min`;
  };

  useEffect(() => {
    let interval;
    if (circuitoAbierto && tiempoRestante > 0) {
      interval = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [circuitoAbierto, tiempoRestante]);

  const votantesFiltrados = votantes.filter((v) =>
    (v.ci?.toString().toLowerCase() || "").includes(search.toLowerCase())
  );

  useEffect(() => {
    localStorage.setItem("circuitoAbierto", circuitoAbierto);
  }, [circuitoAbierto]);

  useEffect(() => {
    console.log("Circuito abierto:", circuitoAbierto);
    console.log("Votantes:", votantes);
    console.log("Votantes filtrados:", votantesFiltrados);
  }, [circuitoAbierto, votantes, votantesFiltrados]);

  const handleOnVotar = (observado) => {
    setIsPersonaOpen(false);
    setEsperandoVoto(true);
    localStorage.setItem("es_observado", observado)
  };

  useEffect(() => {
    if (esperandoVoto && persona) {
      const token = localStorage.getItem("token");
      miembroService.habilitarVotante(token, persona.ci, localStorage.getItem("es_observado"), localStorage.getItem("nro_circuito"));
    }
  }, [esperandoVoto]);

  return (
    <div className={classes.homeContainer}>
      <aside className={classes.sidebar}>
        <img src={escudo} alt="logo" className={classes.logo} />
        <nav className={classes.nav}>
          <button className={classes.active}>Mi circuito</button>
          <button onClick={() => navigate("/configuracion")}>
            Configuración
          </button>
        </nav>
      </aside>

      <main className={classes.main}>
        <div className={classes.header}>
          <div>
            <h1>Circuito N°24923</h1>
            <p>Montevideo</p>
          </div>

          {circuitoAbierto && (
            <>
              <div className={classes.statusBox}>
                <p>
                  <strong>{formatoTiempo(tiempoRestante)}</strong>
                </p>
                <span>Para finalizar las elecciones.</span>
              </div>
              <div className={classes.contador}>
                <span>0/0</span>
                <small>Votantes registrados</small>
              </div>
            </>
          )}
        </div>

        <h3>Votantes de mi circuito</h3>
        <div className={classes.searchBox}>
          <input
            type="text"
            placeholder="Buscar por credencial (Ej: AAAXXXX)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={!circuitoAbierto}
          />
          <FaSearch className={classes.searchIcon} />
        </div>

        <div className={classes.lista}>
          {circuitoAbierto &&
            votantesFiltrados.map((v, i) => (
              <div
                key={i}
                className={classes.votante}
                onClick={() => handleSeleccionarPersona(v)}
                style={{ cursor: "pointer" }}
              >
                <FaUser className={classes.userIcon} />
                <div>
                  <p>{v.nombre}</p>
                  <span>{v.ci}</span>
                </div>
                {v.voto && (
                  <span
                    className={
                      v.tipoVoto === "observado"
                        ? classes.tagObservado
                        : classes.tagVoto
                    }
                  >
                    {v.voto_realizado === 1 ? "Votó" : ""}
                  </span>
                )}
              </div>
            ))}
        </div>

        {!circuitoAbierto ? (
          <button onClick={handleAbrirCircuito} className={classes.abrirBtn}>
            Abrir circuito
          </button>
        ) : (
          <button
            onClick={() => setIsConfirmOpen(true)}
            className={classes.cerrarBtn}
          >
            Cerrar circuito
          </button>
        )}

        {/* Modales */}
        {isPersonaOpen && persona && (
          <PersonaModal
            persona={persona}
            onClose={() => setIsPersonaOpen(false)}
            onVotar={handleOnVotar}
          />
        )}

        {esperandoVoto && persona && (
          <EsperandoVoto
            persona={persona}
            observadoMarcado={observadoMarcado}
            onToggleObservado={toggleObservado}
            onConfirmVoto={() => {
              const actualizados = votantes.map((v) =>
                v.ci === persona.ci
                  ? { ...v, voto: true, tipoVoto: "comun" }
                  : v
              );
              setVotantes(actualizados);
              // setEsperandoVoto(false);
              setPersona(null);
            }}
            onConfirmObservado={() => {
              const actualizados = votantes.map((v) =>
                v.ci === persona.ci ? { ...v, tipoVoto: "observado" } : v
              );
              setVotantes(actualizados);
            }}
            onClose={() => {
              setEsperandoVoto(false);
              setPersona(null);
            }}
          />
        )}

        {isConfirmOpen && (
          <ConfirmarCierreModal
            onConfirm={handleConfirm}
            onCancel={() => setIsConfirmOpen(false)}
            onClose={() => setIsConfirmOpen(false)}
          />
        )}
      </main>
    </div>
  );
}

export default HomeMiembroMesa;
