import React, {useState} from "react";
import classes from "./PersonaModal.module.css";

function PersonaModal({ persona, onClose, onVotar }) {
  const [observado, setObservado] = useState(false);

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

  if (!persona) return null;

  return (
    <div className={classes.modal} onClick={handleBackdropClick}>
      <div className={classes.modalBox}>
        <h2>Información</h2>
        <p>
          <strong>Nombre:</strong> {persona.nombre}
        </p>
        <p>
          <strong>CI:</strong> {persona.ci}
        </p>
        <p>
          <strong>Voto:</strong> {persona.voto_realizado == 1 ? "Sí" : "No"}
        </p>

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
          </>
        )}

        <button className={classes.cerrarButton} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default PersonaModal;
