// NuevoEstablecimiento.jsx
import React, { useState, useRef } from "react";
import styles from "./NuevoEstablecimiento.module.css";

function NuevoEstablecimiento({ onClose }) {
  const overlayRef = useRef();
  const [zonaExiste, setZonaExiste] = useState(true);
  const [ciudadExiste, setCiudadExiste] = useState(true);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleZonaBlur = (e) => {
    const zona = e.target.value.trim().toLowerCase();
    // Simulación: la zona "centro" existe, las demás no
    const zonaExisteEnDB = zona === "centro";
    setZonaExiste(zonaExisteEnDB);
    if (zonaExisteEnDB) setCiudadExiste(true);
  };

  const handleCiudadBlur = (e) => {
    const ciudad = e.target.value.trim().toLowerCase();
    // Simulación: la ciudad "montevideo" existe, las demás no
    const ciudadExisteEnDB = ciudad === "montevideo";
    setCiudadExiste(ciudadExisteEnDB);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log("Nuevo establecimiento:", data);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Nuevo Establecimiento</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nombre</label>
              <input name="nombre" className={styles.input} required />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Zona</label>
              <input name="zona" className={styles.input} onBlur={handleZonaBlur} required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Tipo</label>
              <select name="tipo" className={styles.input} required>
                <option value="escuela">Escuela</option>
                <option value="liceo">Liceo</option>
                <option value="club">Club</option>
              </select>
            </div>
            {!zonaExiste && (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Ciudad</label>
                <input name="ciudad" className={styles.input} onBlur={handleCiudadBlur} required />
              </div>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Dirección</label>
              <input name="direccion" className={styles.input} required />
            </div>
            {!zonaExiste && !ciudadExiste && (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Departamento</label>
                <input name="departamento" className={styles.input} required />
              </div>
            )}
          </div>

          <div className={styles.buttonRow}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
            <button type="submit" className={styles.addButton}>Agregar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoEstablecimiento;
