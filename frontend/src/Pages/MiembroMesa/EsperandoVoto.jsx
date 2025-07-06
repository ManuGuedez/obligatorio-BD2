import React from "react";
import classes from "./EsperandoVoto.module.css";

function EsperandoVoto({ persona, observadoMarcado, onToggleObservado, onClose }) {
  const handleBackdropClick = (e) => {
    // Si clickeaste directamente sobre el fondo
    if (e.target === e.currentTarget) {
     // onClose();
    }
  };
  return (
    <div className={classes.modal} onClick={handleBackdropClick}>
      <div className={classes.modalBox}>
        <h1>Esperando votación</h1>
        <br/>
        <p>{persona.nombre} está votando…</p>
      </div>
    </div>
  );
}

export default EsperandoVoto;
