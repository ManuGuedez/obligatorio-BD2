// NuevosCircuitos.jsx
import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import styles from "./NuevosCircuitos.module.css";

function NuevosCircuitos({ onClose }) {
  const overlayRef = useRef();
  const [fileName, setFileName] = useState("");

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);
      console.log("Circuitos cargados:", json);
    };
    reader.readAsArrayBuffer(file);
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
        </div>
        <div className={styles.buttonRow}>
          <button className={styles.cancelButton} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default NuevosCircuitos;
