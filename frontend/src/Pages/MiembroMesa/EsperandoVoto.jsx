import React from "react";
import classes from "./EsperandoVoto.module.css";

function EsperandoVoto({ persona, onConfirmVoto, onConfirmObservado, onClose}) {
  const handleBackdropClick = (e) => {
    // Si clickeaste directamente sobre el fondo
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div className={classes.modal} onClick={handleBackdropClick} >
      <div className={classes.modalBox}>
        <h2>Esperando votación</h2>
        <p>{persona.nombre} está votando…</p>
      
        {/*         ACA HABRIA QUE VER EL TEMA DE QUE VOTA EL CIUDADANO Y YA SE CONFIRMA EN
        LA VISTA DEL MIEMBRO
      */}

        {/*     <button className={classes.confirmarBtn} onClick={onConfirmVoto}>
          Confirmar que votó
        </button> */}
        <button className={classes.cancelarBtn} onClick={onConfirmObservado}>
          Voto observado
        </button>
      </div>
    </div>
  );
}

export default EsperandoVoto;
