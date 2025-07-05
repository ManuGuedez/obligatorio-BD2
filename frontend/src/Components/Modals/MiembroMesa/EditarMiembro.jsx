// EditarMiembro.jsx
import React, { useRef, useState } from "react";
import styles from "./EditarMiembro.module.css";
import { FaSearch, FaPen, FaTrashAlt } from "react-icons/fa";

function EditarMiembro({ onClose }) {
  const overlayRef = useRef();
  const [ci, setCi] = useState("");
  const [miembro, setMiembro] = useState(null);
  const [editFields, setEditFields] = useState({
    circuito: false,
    organismo: false,
    rol: false,
  });

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    if (ci === "12345678") {
      setMiembro({
        circuito: "100",
        organismo: "mtop",
        rol: "presidente",
      });
    } else {
      alert("Miembro de mesa no encontrado (simulado)");
    }
  };

  const habilitarCampo = (campo) => {
    setEditFields((prev) => ({ ...prev, [campo]: true }));
  };

  const hayCambios = Object.values(editFields).some(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log("Miembro de mesa actualizado:", data);
    onClose();
  };

  const handleEliminar = () => {
    console.log("Miembro de mesa eliminado:", ci);
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
        <h2 className={styles.title}>Editar Miembro de Mesa</h2>

        <form className={styles.form} onSubmit={miembro ? handleSubmit : handleBuscar}>
          <label className={styles.label}>Cédula</label>
          <div className={styles.inputRow}>
            <input
              name="ci"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              className={styles.input}
              required
              disabled={!!miembro}
            />
            <button type="submit" className={styles.iconButton}>
              <FaSearch />
            </button>
          </div>

          {miembro && (
            <>
              <label className={styles.label}>N.º de Circuito</label>
              <div className={styles.inputRow}>
                <input
                  name="circuito"
                  defaultValue={miembro.circuito}
                  className={styles.input}
                  disabled={!editFields.circuito}
                  required
                />
                <FaPen className={styles.editIcon} onClick={() => habilitarCampo("circuito")} />
              </div>

              <label className={styles.label}>Organismo Público</label>
              <div className={styles.inputRow}>
                <select
                  name="organismo"
                  defaultValue={miembro.organismo}
                  className={styles.input}
                  disabled={!editFields.organismo}
                  required
                >
                  <option value="mtop">MTOP</option>
                  <option value="mec">MEC</option>
                  <option value="msp">MSP</option>
                </select>
                <FaPen className={styles.editIcon} onClick={() => habilitarCampo("organismo")} />
              </div>

              <label className={styles.label}>Rol en la Mesa</label>
              <div className={styles.inputRow}>
                <select
                  name="rol"
                  defaultValue={miembro.rol}
                  className={styles.input}
                  disabled={!editFields.rol}
                  required
                >
                  <option value="presidente">Presidente</option>
                  <option value="secretario">Secretario</option>
                  <option value="vocal">Vocal</option>
                </select>
                <FaPen className={styles.editIcon} onClick={() => habilitarCampo("rol")} />
              </div>

              <div className={styles.actionRow}>
                {hayCambios && (
                  <button type="submit" className={styles.deleteButton}>
                    Guardar cambios
                  </button>
                )}
                <button type="button" className={styles.deleteButton} onClick={handleEliminar}>
                  <FaTrashAlt /> eliminar miembro
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditarMiembro;
