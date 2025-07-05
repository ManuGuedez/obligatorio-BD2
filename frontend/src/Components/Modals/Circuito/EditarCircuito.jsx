// EditarCircuito.jsx
import React, { useRef, useState } from "react";
import styles from "./EditarCircuito.module.css";
import { FaSearch, FaPen, FaTrashAlt } from "react-icons/fa";

function EditarCircuito({ onClose }) {
  const overlayRef = useRef();
  const [numero, setNumero] = useState("");
  const [circuito, setCircuito] = useState(null);
  const [editFields, setEditFields] = useState({
    accesible: false,
    establecimiento: false,
  });

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    if (numero === "123") {
      setCircuito({ numero: "123", accesible: true, establecimiento: "Liceo 1" });
    } else {
      alert("Circuito no encontrado (simulado)");
    }
  };

  const habilitarCampo = (campo) => {
    setEditFields((prev) => ({ ...prev, [campo]: true }));
  };

  const hayCambios = Object.values(editFields).some((v) => v);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log("Circuito actualizado:", data);
    onClose();
  };

  const handleEliminar = () => {
    console.log("Circuito eliminado:", numero);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Editar información de un circuito</h2>
        <form className={styles.form} onSubmit={circuito ? handleSubmit : handleBuscar}>
          <label className={styles.label}>N° Circuito</label>
          <div className={styles.inputRow}>
            <input
              name="numero"
              className={styles.input}
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
              disabled={!!circuito}
            />
            <button type="submit" className={styles.iconButton}>
              <FaSearch />
            </button>
          </div>

          {circuito && (
            <>
              <label className={styles.label}>Accesibilidad</label>
              <div className={styles.inputRow}>
                <select
                  name="accesible"
                  className={styles.input}
                  defaultValue={circuito.accesible ? "true" : "false"}
                  disabled={!editFields.accesible}
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
                <FaPen className={styles.editIcon} onClick={() => habilitarCampo("accesible")} />
              </div>

              <label className={styles.label}>Establecimiento</label>
              <div className={styles.inputRow}>
                <input
                  name="establecimiento"
                  defaultValue={circuito.establecimiento}
                  className={styles.input}
                  required
                  disabled={!editFields.establecimiento}
                />
                <FaPen className={styles.editIcon} onClick={() => habilitarCampo("establecimiento")} />
              </div>

              <div className={styles.actionRow}>
                {hayCambios && (
                  <button type="submit" className={styles.deleteButton}>
                    Guardar cambios
                  </button>
                )}
                <button type="button" className={styles.deleteButton} onClick={handleEliminar}>
                  <FaTrashAlt /> Eliminar Circuito
                </button>
              </div>
            </>
          )}
        </form>

        <button className={styles.closeButton} onClick={onClose}>X</button>
      </div>
    </div>
  );
}

export default EditarCircuito;
