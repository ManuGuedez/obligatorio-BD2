import React from "react";
import classes from "./ConfirmarCierreModal.module.css";

function ConfirmarCierreModal({ onConfirm, onCancel, onClose }) {
  const handleBackdropClick = (e) => {
    // Si clickeaste directamente sobre el fondo (y no sobre el modalBox)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div className={classes.modal} onClick={handleBackdropClick}>
      <div className={classes.modalBox}>
        <h2>¿Seguro que deseas cerrar el circuito?</h2>
        <button onClick={onConfirm}>Sí</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

export default ConfirmarCierreModal;
