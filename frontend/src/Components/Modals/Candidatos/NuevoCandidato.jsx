import React, { useRef } from "react";
import styles from "./NuevoCandidato.module.css";

function NuevoCandidato({ onClose }) {
  const overlayRef = useRef();

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Datos del formulario
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Lógica futura para integración backend
    console.log("Enviando candidato:", data);
    // Aquí se podría hacer un fetch o axios.post

    // Por ahora cerramos el modal
    onClose();
  };

  return (
    <div className={styles.modalOverlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Añadir Candidato</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            C.I.
            <input name="ci" type="text" className={styles.input} required />
          </label>
          <div className={styles.buttonRow}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.submitButton}>Añadir Candidato</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoCandidato;
