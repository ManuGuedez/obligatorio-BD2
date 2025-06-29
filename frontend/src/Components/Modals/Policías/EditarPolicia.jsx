import React, { useRef, useState } from "react";
import styles from "./EditarPolicia.module.css";
import { FaSearch, FaTrashAlt, FaPen } from "react-icons/fa";

function EditarPolicia({ onClose }) {
  const overlayRef = useRef();
  const [ci, setCI] = useState("");
  const [policia, setPolicia] = useState("");
  const [editFields, setEditFields] = useState({
    comisaria: false,
    establecimiento: false
  });

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    if (ci === "11111111") {
      setPolicia({
        comisaria: "Comisaria Actual",
        establecimiento: "Establecimiento Actual"
      });
    } else {
      alert("Policía no encontrado (simulado)");
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
    console.log("Actualizando policía:", data);
    onClose();
  };

  const handleEliminar = () => {
    console.log("Eliminar policía con CI:", ci);
    onClose();
  };

  return (
    <div
      className={styles.modalOverlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Editar información de un policía</h2>
        <form
          className={styles.form}
          onSubmit={policia ? handleSubmit : handleBuscar}
        >
          <label className={styles.label}>C.I.</label>
          <div className={styles.ciRow}>
            <input
              name="ci"
              className={styles.input}
              value={ci}
              onChange={(e) => setCI(e.target.value)}
              required
              disabled={!!policia}
            />
            <button type="submit" className={styles.iconButton}>
              <FaSearch />
            </button>
          </div>

          {policia && (
            <>
              <label className={styles.label}>Comisaría</label>
              <div className={styles.inputRow}>
                <input
                  name="comisaria"
                  defaultValue={policia.comisaria}
                  className={styles.input}
                  required
                  disabled={!editFields.comisaria}
                />
                <FaPen
                  className={styles.editIcon}
                  onClick={() => habilitarCampo("comisaria")}
                />
              </div>

              <label className={styles.label}>Establecimiento</label>
              <div className={styles.inputRow}>
                <input
                  name="establecimiento"
                  defaultValue={policia.establecimiento}
                  className={styles.input}
                  required
                  disabled={!editFields.establecimiento}
                />
                <FaPen
                  className={styles.editIcon}
                  onClick={() => habilitarCampo("establecimiento")}
                />
              </div>

              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={handleEliminar}
                >
                  <FaTrashAlt /> Eliminar policía
                </button>
                {hayCambios && (
                  <button type="submit" className={styles.deleteButton}>
                    Guardar cambios
                  </button>
                )}
              </div>
            </>
          )}
        </form>

        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
}

export default EditarPolicia;
