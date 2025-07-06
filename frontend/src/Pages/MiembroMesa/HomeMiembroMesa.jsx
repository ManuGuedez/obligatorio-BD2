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
  const [circuitoAbierto, setCircuitoAbierto] = useState(
    () => localStorage.getItem("circuitoAbierto") === "true"
  );
  const [tiempoRestante, setTiempoRestante] = useState(10 * 60 * 60);
  const [votantes, setVotantes] = useState([]);
  const [nroCircuito, setNroCircuito] = useState(null);
  const [persona, setPersona] = useState(null);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [searchCred, setSearchCred] = useState("");
  const [externalCitizen, setExternalCitizen] = useState(null);
  const [esperandoVoto, setEsperandoVoto] = useState(false);
  const navigate = useNavigate();

  // Carga inicial de ciudadanos de mi circuito
  useEffect(() => {
    const fetchVotantes = async () => {
      try {
        const token = localStorage.getItem("token");
        const ciudadanos = await miembroService.getCiudadanos(token);
        setVotantes(ciudadanos);
        if (ciudadanos.length > 0) {
          setNroCircuito(ciudadanos[0].nro_circuito);
        }
      } catch (error) {
        console.error("Error al traer los ciudadanos:", error);
      }
    };
    fetchVotantes();
  }, []);

  // Socket listeners
  useSocket({
    onVotanteHabilitado: ({ ciCiudadano }) => {
      setVotantes(prev => prev.map(v => v.ci === ciCiudadano ? { ...v, habilitado: true } : v));
    },
    onVotoEmitido: data => {
      setVotantes(prev => prev.map(v => v.ci === data.ci_ciudadano ? { ...v, yaVoto: true } : v));
      setEsperandoVoto(false);
      setPersona(null);
    }
  });

  // Contador de tiempo
  useEffect(() => {
    if (circuitoAbierto && tiempoRestante > 0) {
      const interval = setInterval(() => setTiempoRestante(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [circuitoAbierto, tiempoRestante]);

  // Persistir estado del circuito
  useEffect(() => {
    localStorage.setItem("circuitoAbierto", circuitoAbierto);
  }, [circuitoAbierto]);

  // Filtrar votantes por credencial
  const votantesFiltrados = votantes.filter(v =>
    formatearCredencial(v).toLowerCase().includes(searchCred.toLowerCase())
  );

  // Buscar externo por CC cuando no hay coincidencias locales
  useEffect(() => {
    if (circuitoAbierto && searchCred && votantesFiltrados.length === 0) {
      const fetchExternal = async () => {
        const token = localStorage.getItem("token");
        try {
          const cc = searchCred.toUpperCase().trim();
          const citizen = await miembroService.getCiudadanoByCC(token, cc);
          setExternalCitizen(citizen);
        } catch (err) {
          console.error("Error fetching ciudadano by CC:", err);
          setExternalCitizen(null);
        }
      };
      fetchExternal();
    } else {
      setExternalCitizen(null);
    }
  }, [searchCred, votantesFiltrados, circuitoAbierto]);

  // Habilitar votante remoto si se confirma el voto
  useEffect(() => {
    if (esperandoVoto && persona) {
      const token = localStorage.getItem("token");
      miembroService.habilitarVotante(token, persona.ci);
    }
  }, [esperandoVoto, persona]);

  // Handlers
  const handleAbrirCircuito = () => setCircuitoAbierto(true);
  const handleSeleccionarPersona = v => {
    setPersona(v);
    setIsPersonaOpen(true);
  };
  const handleOnVotar = () => {
    setIsPersonaOpen(false);
    setEsperandoVoto(true);
  };
  const handleConfirm = () => {
    setIsConfirmOpen(false);
    setCircuitoAbierto(false);
    navigate("/Estadisticas");
  };

  const formatoTiempo = segundos => {
    const hrs = Math.floor(segundos / 3600);
    const mins = Math.floor((segundos % 3600) / 60);
    return `${hrs}hrs ${mins.toString().padStart(2, "0")}min`;
  };

  return (
    <div className={classes.homeContainer}>
      <aside className={classes.sidebar}>
        <img src={escudo} alt="logo" className={classes.logo} />
        <nav className={classes.nav}>
          <button className={classes.active}>Mi circuito</button>
          <button onClick={() => navigate("/configuracion")} className={classes.active}>
            Configuración
          </button>
        </nav>
      </aside>
      <main className={classes.main}>
        <div className={classes.header}>
          <div>
            <h1>{nroCircuito ? `Circuito N°${nroCircuito}` : "Circuito N°…"}</h1>
            <p>Montevideo</p>
          </div>
          {circuitoAbierto && (
            <>
              <div className={classes.statusBox}>
                <strong>{formatoTiempo(tiempoRestante)}</strong>
                <span>Para finalizar las elecciones.</span>
              </div>
              <div className={classes.contador}>
                <span>{votantes.filter(v => v.habilitado).length}/{votantes.length}</span>
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
            value={searchCred}
            onChange={e => setSearchCred(e.target.value)}
            disabled={!circuitoAbierto}
          />
          <FaSearch className={classes.searchIcon} />
        </div>
        <div className={classes.lista}>
          {circuitoAbierto && votantesFiltrados.map((v, i) => (
            <div key={i} className={classes.votante} onClick={() => handleSeleccionarPersona(v)}>
              <FaUser className={classes.userIcon} />
              <div>
                <p>{v.nombre}</p>
                <span>{formatearCredencial(v)}</span>
              </div>
              {v.voto && (
                <span className={v.tipoVoto === "observado" ? classes.tagObservado : classes.tagVoto}>
                  {v.voto_realizado === 1 ? "Votó" : ""}
                </span>
              )}
            </div>
          ))}
          {externalCitizen && (
            <div className={classes.votante} onClick={() => handleSeleccionarPersona(externalCitizen)}>
              <FaUser className={classes.userIcon} />
              <div>
                <p>{externalCitizen.nombre} {externalCitizen.apellido}</p>
                <span>{externalCitizen.serie_credencial}{externalCitizen.nro_credencial}</span>
              </div>
              <span className={classes.tagObservado}>Voto observado</span>
            </div>
          )}
        </div>
        {!circuitoAbierto ? (
          <button onClick={handleAbrirCircuito} className={classes.abrirBtn}>Abrir circuito</button>
        ) : (
          <button onClick={() => setIsConfirmOpen(true)} className={classes.cerrarBtn}>Cerrar circuito</button>
        )}
        {isPersonaOpen && persona && (
          <PersonaModal persona={persona} onClose={() => setIsPersonaOpen(false)} onVotar={handleOnVotar} />
        )}
        {esperandoVoto && persona && (
          <EsperandoVoto
            persona={persona}
            observadoMarcado={persona.tipoVoto === "observado"}
            onToggleObservado={() => {}}
            onConfirmVoto={() => {
              setVotantes(prev => prev.map(x => x.ci === persona.ci ? { ...x, voto: true, tipoVoto: "comun" } : x));
              setPersona(null);
            }}
            onConfirmObservado={() => {
              setVotantes(prev => prev.map(x => x.ci === persona.ci ? { ...x, tipoVoto: "observado" } : x));
            }}
            onClose={() => { setEsperandoVoto(false); setPersona(null); }}
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



// Agregar boton de buscar, cosa de que cuando termine de escribir 
// la credencial se pueda buscar usando getCiudadanoByCC