import React, { useRef, useState } from "react";
import styles from "./EditarCandidato.module.css";
import { FaSearch, FaTrashAlt, FaPen } from "react-icons/fa";

function EditarCandidato({ onClose }) {
  const overlayRef = useRef();
  const [ci, setCI] = useState("");
  const [candidato, setCandidato] = useState("");

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    if (ci === "11111111") {
      // Simulación de búsqueda exitosa
      setCandidato({
        ci: "11111111",
        nombre: "Juan Pérez",
        partido: "Partido A",
        fechaRegistro: "2023-01-01",
      });
    } else {
      alert("Candidato no encontrado (simulado)");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log("Actualizando candidato:", data);
    onClose();
  };

  const handleEliminar = () => {
    console.log("Eliminar candidato con CI:", ci);
    onClose();
  };

  return (
    <div
      className={styles.modalOverlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Editar información de un candidato</h2>
        <form
          className={styles.form}
          onSubmit={candidato ? handleSubmit : handleBuscar}
        >
          <label className={styles.label}>C.I.</label>
          <div className={styles.ciRow}>
            <input
              name="ci"
              className={styles.input}
              value={ci}
              onChange={(e) => setCI(e.target.value)}
              required
              disabled={!!candidato}
            />
            <button type="submit" className={styles.iconButton}>
              <FaSearch />
            </button>
          </div>

          {candidato && (
            <>
              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={handleEliminar}
                >
                  <FaTrashAlt /> Eliminar candidato
                </button>
                <button type="submit" className={styles.deleteButton}>
                  Guardar cambios
                </button>
              </div>
            </>
          )}
        </form>

        <button className={`${styles.closeButton} delete has-background-link`} onClick={onClose}/>
      </div>
    </div>
  );
}

export default EditarCandidato;
