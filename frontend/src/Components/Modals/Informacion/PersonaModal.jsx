import React, { useState, useEffect } from "react";
import classes from "./PersonaModal.module.css";
import miembroService from "../../../services/miembroServices";

function PersonaModal({ persona, onClose, onVotar }) {
  const [observado, setObservado] = useState(false);
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
