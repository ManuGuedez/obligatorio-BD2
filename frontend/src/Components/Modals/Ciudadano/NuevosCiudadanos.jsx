// NuevosCiudadanos.jsx
import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import styles from "./NuevosCiudadanos.module.css";

function NuevosCiudadanos({ onClose }) {
  const overlayRef = useRef();
  const [archivo, setArchivo] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState("");

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    procesarArchivo(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      procesarArchivo(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const procesarArchivo = (file) => {
    setArchivo(file);
    setNombreArchivo(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      console.log("Datos procesados:", json);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleEnviar = () => {
    if (!archivo) return;
    // Lógica futura de envío al backend
    console.log("Archivo cargado listo para enviar:", archivo);
    onClose();
  };

  return (
    <div
      className={styles.modalOverlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h2 className={styles.title}>Adjuntar archivo</h2>

        <div
          className={styles.dropArea}
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
        >
          {nombreArchivo || "Drag And Drop"}
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        </div>

        <button
          className={styles.submitButton}
          onClick={handleEnviar}
          disabled={!archivo}
        >
          Añadir Ciudadanos
        </button>
      </div>
    </div>
  );
}

export default NuevosCiudadanos;
