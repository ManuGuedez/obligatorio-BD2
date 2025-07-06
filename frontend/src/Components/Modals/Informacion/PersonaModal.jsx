<<<<<<< HEAD
import React, {useState} from "react";
=======
import React, { useState, useEffect } from "react";
>>>>>>> fd688106e91f3ac888bbf541e72c8c14e5a8bffb
import classes from "./PersonaModal.module.css";
import miembroService from "../../../services/miembroServices";

function PersonaModal({ persona, onClose, onVotar }) {
  const [observado, setObservado] = useState(false);
<<<<<<< HEAD

  const handleBackdropClick = (e) => {
    // Si clickeaste directamente sobre el fondo
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleToggle = () => {
    setObservado((prev) => !prev);
  };

  const handleVotar = () => {
    onVotar(observado); // podemos enviar el estado de observado si querés manejarlo afuera también
  };

=======
  const [yaVoto, setYaVoto] = useState(null);   // null = cargando
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!persona) return;
    setYaVoto(null);  // dispara estado de “cargando”
    const fetchEstado = async () => {
      try {
        const data = await miembroService.getCiudadanoByCi(token, persona.ci);
        // data.voto_realizado viene como true/false
        setYaVoto(data?.voto_realizado == 1);
      } catch (err) {
        console.error("Error al obtener estado de voto:", err);
        setYaVoto(false);
      }
    };
    fetchEstado();
  }, [persona, token]);

  // Si no hay persona, no muestro nada
>>>>>>> fd688106e91f3ac888bbf541e72c8c14e5a8bffb
  if (!persona) return null;

  return (
    <div className={classes.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={classes.modalBox}>
        {yaVoto === null ? (
          <p>Cargando estado de voto…</p>
        ) : (
          <>
            <h2>Información del votante</h2>
            <p><strong>Nombre:</strong> {persona.nombre} {persona.apellido}</p>
            <p><strong>CI:</strong> {persona.ci}</p>
            <p>
              <strong>Estado de voto:</strong>{" "}
              {yaVoto ? "Ya votó" : "Sin votar"}
            </p>

<<<<<<< HEAD
        {!persona.voto_realizado == 1 && (
          <>
            <div className={classes.switchContainer}>
              <br/>
              <span>Voto Observado</span>
              <br/>
              <label className={classes.switchLabel}>
                <input
                  type="checkbox"
                  checked={observado}
                  onChange={handleToggle}
                />
                <span className={classes.switchSlider}></span>
              </label>
            </div>

            <button className={classes.votarButton} onClick={handleVotar}>
              VOTAR
            </button>
=======
            {!yaVoto && (
              <div className={classes.controles}>
                <label>
                  <input
                    type="checkbox"
                    checked={observado}
                    onChange={() => setObservado(prev => !prev)}
                  /> Marcar como observado
                </label>
                <button
                  className={classes.votarButton}
                  onClick={() => { onVotar(observado); onClose(); }}
                >
                  Confirmar voto
                </button>
              </div>
            )}
>>>>>>> fd688106e91f3ac888bbf541e72c8c14e5a8bffb
          </>
        )}

        <button
          className={classes.cerrarButton}
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default PersonaModal;
