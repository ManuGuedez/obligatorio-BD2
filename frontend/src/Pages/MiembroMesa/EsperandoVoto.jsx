import React from "react";
import styles from "./EsperandoVoto.module.css";

function EsperandoVoto({ persona, onConfirm, onClose }) {
  if (!persona) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modal} onClick={handleBackdropClick}>
      <div className={styles.modalBox}>
        <h2>Esperando confirmación</h2>
        <p>
          <strong>{persona.nombre}</strong> está emitiendo su voto.
        </p>

        {persona.tipoVoto === "observado" && (
          <p style={{ color: "#dc2626", fontWeight: "bold", marginTop: "10px" }}>
            Voto observado
          </p>
        )}

      
        <button className={styles.cancelarBtn} onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default EsperandoVoto;
