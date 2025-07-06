// NuevosCircuitos.jsx
import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import styles from "./NuevosCircuitos.module.css";
import adminService from "../../../services/adminServices";

function NuevosCircuitos({ onClose }) {
  const overlayRef = useRef();
  const [fileName, setFileName] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [msj, setMsj] = useState("");

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = async (file) => {
    setFileName(file.name);
    setMsj("");
    const token = localStorage.getItem("token");

    try {
      setSubiendo(true);
      const response = await adminService.bulkAddCircuitos(token, file);

      if (response.code === 200) {
        setMsj("✔️ Circuitos cargados exitosamente.");
      } else {
        setMsj(`❌ Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setMsj("❌ Error al subir el archivo.");
    } finally {
      setSubiendo(false);
    }
  };


  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div
      className={styles.modalOverlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Cargar nuevos circuitos</h2>
        <div className={styles.dropZone}>
          <p>Arrastrá y soltá un archivo .xlsx aquí</p>
          <p>o</p>
          <input type="file" accept=".xlsx, .xls" onChange={handleInputChange} />
          {fileName && <p className={styles.fileName}>Archivo: {fileName}</p>}
          {msj && <p className={styles.mensaje}>{msj}</p>}
          {subiendo && <p className={styles.mensaje}>Subiendo archivo...</p>}
        </div>
        <div className={styles.buttonRow}>
          <button className={styles.cancelButton} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default NuevosCircuitos;
