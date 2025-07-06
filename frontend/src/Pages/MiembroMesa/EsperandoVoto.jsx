import React from "react";
import classes from "./EsperandoVoto.module.css";

function EsperandoVoto({ persona, onConfirm, onClose }) {
  if (!persona) return null;

  function EsperandoVoto({ persona, observadoMarcado, onToggleObservado, onClose }) {
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        // onClose();
      }
    };
    return (
      <div className={classes.modal} onClick={handleBackdropClick}>
        <div className={classes.modalBox}>
          <h2>Esperando votación</h2>
          <p>{persona.nombre} está votando…</p>

          <button
            className={observadoMarcado ? classes.confirmarBtn : classes.cancelarBtn}
            onClick={onToggleObservado}
          >
            {observadoMarcado ? "Desmarcar voto observado" : "Voto observado"}
          </button>

        </div>
      </div>
    );
  }
}

export default EsperandoVoto;
