import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./HomeMiembroMesa.module.css";
import PersonaModal from "../../Components/Modals/Informacion/PersonaModal";
import ConfirmarCierreModal from "../../Components/Modals/ConfirmarCierreMesa/ConfirmarCierreModal";
import EsperandoVoto from "./EsperandoVoto";
import { FaUser, FaSearch } from "react-icons/fa";
import escudo from "../../../public/Escudo20Uruguay_19.png";
import useSocket from "../../hooks/useSocket";
import miembroService from "../../services/miembroServices";

const formatearCredencial = (v) => `${v.serie_credencial}${v.nro_credencial}`;

export default function HomeMiembroMesa() {
  const [circuitoAbierto, setCircuitoAbierto] = useState(() => localStorage.getItem("circuitoAbierto") === "true");
  const [tiempoRestante, setTiempoRestante] = useState(10 * 60 * 60);
  const [votantes, setVotantes] = useState([]);
  const [nroCircuito, setNroCircuito] = useState(null);
  const [persona, setPersona] = useState(null);
  const [yaVoto, setYaVoto] = useState(null);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [searchCred, setSearchCred] = useState("");
  const [externalCitizen, setExternalCitizen] = useState(null);
  const [esperandoVoto, setEsperandoVoto] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 1. Obtener votantes
  useEffect(() => {
    const fetchVotantes = async () => {
      try {
        const data = await miembroService.getCiudadanos(token);
        const ciudadanos = data.map(c => ({ ...c, yaVoto: c.voto_realizado === 1 }));
        setVotantes(ciudadanos);
        if (ciudadanos.length) setNroCircuito(ciudadanos[0].nro_circuito);
      } catch (error) {
        console.error("Error al traer los ciudadanos:", error);
      }
    };
    fetchVotantes();
  }, [token]);

  // 2. Verificar estado individual
  useEffect(() => {
    if (!persona) return;
    setYaVoto(null);
    const fetchEstado = async () => {
      try {
        const data = await miembroService.getCiudadanoByCi(token, persona.ci);
        setYaVoto(data?.voto_realizado === 1);
      } catch (err) {
        console.error("Error al obtener estado de voto:", err);
        setYaVoto(false);
      }
    };
    fetchEstado();
  }, [persona, token]);

  // 3. WebSocket: escucha de voto emitido
  useSocket({
    onVotanteHabilitado: ({ ciCiudadano }) => {
      setVotantes(prev =>
        prev.map(v => v.ci === ciCiudadano ? { ...v, habilitado: true } : v)
      );
    },
    onVotoEmitido: ({ ci_ciudadano }) => {
      setVotantes(prev =>
        prev.map(v => v.ci === ci_ciudadano ? { ...v, yaVoto: true } : v)
      );

      if (persona?.ci === ci_ciudadano) {
        setEsperandoVoto(false);
        setPersona(null);
      }
    }
  });

  useEffect(() => {
    if (circuitoAbierto && tiempoRestante > 0) {
      const timer = setInterval(() => setTiempoRestante(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [circuitoAbierto, tiempoRestante]);

  useEffect(() => {
    localStorage.setItem("circuitoAbierto", circuitoAbierto);
  }, [circuitoAbierto]);

  const handleOnVotar = (observado) => {
    setIsPersonaOpen(false);
    setEsperandoVoto(true);
    localStorage.setItem("es_observado", observado)
  };
  
  // Handler búsqueda externa
  const handleSearchExternal = async () => {
    const cc = searchCred.toUpperCase().trim();
    if (!cc) return;
    try {
      const citizen = await miembroService.getCiudadanoByCC(token, cc);
      if (citizen) citizen.yaVoto = citizen.voto_realizado === 1;
      setExternalCitizen(citizen);
    } catch {
      setExternalCitizen(null);
    }
  };

  useEffect(() => {
    if (esperandoVoto && persona) {
      const token = localStorage.getItem("token");
      miembroService.habilitarVotante(token, persona.ci, localStorage.getItem("es_observado"), localStorage.getItem("nro_circuito"));
    } if (esperandoVoto && persona) miembroService.habilitarVotante(token, persona.ci);
  }, [esperandoVoto, persona, token]);

  const handleAbrirCircuito = async () => {
    try {
      await miembroService.abrirCircuito(token, nroCircuito);
      setCircuitoAbierto(true);
    } catch {
      alert("No se pudo abrir el circuito.");
    }
  };

  const handleSeleccionarPersona = v => { setPersona(v); setIsPersonaOpen(true); };
  const handleConfirm = async () => {
    setIsConfirmOpen(false);
    try {
      await miembroService.cerrarCircuito(token, nroCircuito);
      setCircuitoAbierto(false);
      navigate("/Estadisticas");
    } catch {
      alert("No se pudo cerrar el circuito.");
    }
  };

  const votantesFiltrados = votantes.filter(v =>
    formatearCredencial(v).toLowerCase().includes(searchCred.toLowerCase())
  );

  const formatoTiempo = s =>
    `${Math.floor(s / 3600)}hrs ${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}min`;

  if (!circuitoAbierto) {
    return (
      <div className={classes.homeContainer}>
        <aside className={classes.sidebar}>
          <img src={escudo} alt="logo" className={classes.logo} />
          <nav className={classes.nav}>
            <button className={classes.active}>Mi circuito</button>
            <button onClick={() => navigate("/configuracion")} className={classes.active}>Configuración</button>
          </nav>
        </aside>
        <main className={classes.main}>
          <button onClick={handleAbrirCircuito} className={classes.abrirBtn}>Abrir circuito</button>
        </main>
      </div>
    );
  }

  return (
    <div className={classes.homeContainer}>
      <aside className={classes.sidebar}>
        <img src={escudo} alt="logo" className={classes.logo} />
        <nav className={classes.nav}>
          <button className={classes.active}>Mi circuito</button>
          <button onClick={() => navigate("/configuracion")} className={classes.active}>Configuración</button>
        </nav>
      </aside>

      <main className={classes.main}>
        <div className={classes.header}>
          <div>
            <h1>{nroCircuito ? `Circuito N°${nroCircuito}` : "Circuito N°…"}</h1>
            <p>Montevideo</p>
          </div>
          <div className={classes.statusBox}>
            <strong>{formatoTiempo(tiempoRestante)}</strong>
            <span>Para finalizar las elecciones.</span>
          </div>
          <div className={classes.contador}>
            <span>{votantes.filter(v => v.habilitado).length}/{votantes.length}</span>
            <small>Votantes registrados</small>
          </div>
        </div>

        <h3>Votantes de mi circuito</h3>
        <div className={classes.searchBox}>
          <input
            type="text"
            placeholder="Buscar por credencial (Ej: AAAXXXX)"
            value={searchCred}
            onChange={e => setSearchCred(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearchExternal()}
          />
          <button onClick={handleSearchExternal} className={classes.searchIconButton} disabled={!searchCred.trim()}>
            <FaSearch className={classes.searchIcon} />
          </button>
        </div>

        <div className={classes.lista}>
          {votantesFiltrados.map((v, i) => (
            <div key={i} className={classes.votante} onClick={() => handleSeleccionarPersona(v)}>
              <FaUser className={classes.userIcon} />
              <div className={classes.votanteInfo}>
                <p>{v.nombre}</p>
                <span>{formatearCredencial(v)}</span>
              </div>
              {v.tipoVoto === "observado" ? (
                <span className={classes.statusLabelObservado}>Voto observado</span>
              ) : v.yaVoto ? (
                <span className={classes.statusLabelVoto}>Ya votó</span>
              ) : null}
            </div>
          ))}

          {externalCitizen && (
            <div className={classes.votante} onClick={() => handleSeleccionarPersona(externalCitizen)}>
              <FaUser className={classes.userIcon} />
              <div className={classes.votanteInfo}>
                <p>{externalCitizen.nombre} {externalCitizen.apellido}</p>
                <span>{externalCitizen.serie_credencial}{externalCitizen.nro_credencial}</span>
              </div>
              {externalCitizen.tipoVoto === "observado" ? (
                <span className={classes.statusLabelObservado}>Voto observado</span>
              ) : externalCitizen.yaVoto ? (
                <span className={classes.statusLabelVoto}>Ya votó</span>
              ) : null}
            </div>
          )}
        </div>

        <button onClick={() => setIsConfirmOpen(true)} className={classes.cerrarBtn}>Cerrar circuito</button>

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
            observadoMarcado={persona.tipoVoto === "observado"}
            onToggleObservado={() => {}}
            onConfirmVoto={() => {
              setVotantes(prev =>
                prev.map(x => x.ci === persona.ci ? { ...x, yaVoto: true, tipoVoto: "comun" } : x)
              );
              setPersona(null);
            }}
            onConfirmObservado={() => {
              setVotantes(prev =>
                prev.map(x => x.ci === persona.ci ? { ...x, tipoVoto: "observado" } : x)
              );
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
