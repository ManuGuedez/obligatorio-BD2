import React, { useRef, useState } from "react";
import styles from "./NuevoCircuito.module.css";

function NuevoCircuito({ onClose, setModal }) {
  const overlayRef = useRef();
  const [accesible, setAccesible] = useState(false);
  const [establecimiento, setEstablecimiento] = useState("");
  const [numero, setNumero] = useState("");

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const circuito = {
      numero,
      accesible,
      establecimiento
    };
    console.log("Nuevo circuito:", circuito);
    // lógica para enviar al backend
    onClose();
  };

  const handleCrearEstablecimiento = () => {
    onClose(); // cerramos el modal actual
    setTimeout(() => setModal("nuevoEstablecimiento"), 100); // abrimos el nuevo modal
  };


  return (
    <div ref={overlayRef} className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Nuevo Circuito</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>N° Circuito</label>
          <input
            className={styles.input}
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
          />

          <label className={styles.label}>Accesibilidad</label>
          <div
            className={`${styles.switch} ${accesible ? styles.on : styles.off}`}
            onClick={() => setAccesible((prev) => !prev)}
          >
            <div className={styles.knob}></div>
          </div>

          <label className={styles.label}>Establecimiento</label>
          <select
            className={styles.select}
            value={establecimiento}
            onChange={(e) => setEstablecimiento(e.target.value)}
          >
            <option value="" disabled>Seleccionar...</option>
            <option value="liceo1">Liceo 1</option>
            <option value="liceo2">Liceo 2</option>
          </select>

          <p className={styles.subLink} onClick={handleCrearEstablecimiento}>
            ¿No encontrás el establecimiento? Crear uno
          </p>

          <div className={styles.buttonRow}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.submitButton}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoCircuito;
