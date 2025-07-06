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
        <h2>Esperando votación</h2>
        <p>{persona.nombre} está votando…</p>

        <button
          className={observadoMarcado ? classes.confirmarBtn : classes.cancelarBtn}
          onClick={onToggleObservado}
        >
          {observadoMarcado ? "Desmarcar voto observado" : "Voto observado"}
        </button>

        {/* Podés dejar otros botones como Confirmar voto o Cancelar */}
      </div>
    </div>
  );
}

export default EsperandoVoto;
