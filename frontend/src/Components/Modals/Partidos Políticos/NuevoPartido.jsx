import React, { useRef } from "react";
import styles from "./NuevoPartido.module.css";
import adminService from "../../../services/adminServices";

function NuevoPartido({ onClose }) {
  const overlayRef = useRef();

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
      await adminService.crearPartido(token, data);
      alert("Partido creado correctamente.");
      onClose();
    } catch (error) {
      console.error("Error al crear el partido:", error);
      alert("Error al crear el partido. Verificá los datos e intentá nuevamente.");
    }
  };


  return (
    <div className={styles.modalOverlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Añadir Partido</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Nombre
            <input name="nombre" type="text" className={styles.input} required />
          </label>
          <label>
            Calle
            <input name="calle" type="text" className={styles.input} required />
          </label>
          <label>
            Número
            <input name="numero" type="number" className={styles.input} required />
          </label>
          <label>
            Teléfono
            <input name="telefono" type="text" className={styles.input} required />
          </label>
          <label>
            Código Postal
            <input name="codPostal" type="number" className={styles.input} required />
          </label>
          <label>
            C.I. Presidente
            <input name="ci_presidente" type="text" className={styles.input} required />
          </label>
          <label>
            C.I. Vicepresidente
            <input name="ci_vicepresidente" type="text" className={styles.input} required />
          </label>
          <label>
            Color del Partido
            <input name="color" type="color" className={styles.input} styles={{innerHeight: "3px"}} required />
          </label>
          <div className={styles.buttonRow}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.submitButton}>Añadir Partido</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoPartido;
