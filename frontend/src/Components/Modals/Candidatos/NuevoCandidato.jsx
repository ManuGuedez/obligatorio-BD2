import React, { useRef } from "react";
import styles from "./NuevoCandidato.module.css";
import adminService from "../../../services/adminServices";

function NuevoCandidato({ onClose }) {
  const overlayRef = useRef();
  const [ci, setCi] = React.useState("");

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const token = localStorage.getItem("token");

    try {
      await adminService.crearCandidato(token, data.ci);
      onClose();
    } catch (error) {
      console.error("Error al crear candidato:", error);
    }
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
