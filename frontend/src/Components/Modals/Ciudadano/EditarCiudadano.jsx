import React, { useRef, useState } from "react";
import styles from "./EditarCiudadano.module.css";
import { FaSearch, FaTrashAlt, FaPen } from "react-icons/fa";

function EditarCiudadano({ onClose }) {
  const overlayRef = useRef();
  const [ci, setCi] = useState("");
  const [ciudadano, setCiudadano] = useState(null);
  const [editFields, setEditFields] = useState({
    nombre: false,
    apellido: false,
    serie: false,
    numero: false,
  });

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    if (ci === "11111111") {
      setCiudadano({
        nombre: "NombreActual",
        apellido: "ApellidoActual",
        serie: "AAA",
        numero: "111",
      });
    } else {
      alert("Ciudadano no encontrado (simulado)");
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
    console.log("Actualizando ciudadano:", data);
    onClose();
  };

  const handleEliminar = () => {
    console.log("Eliminar ciudadano con CI:", ci);
    onClose();
  };

  return (
    <div
      className={styles.modalOverlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Editar información de un ciudadano</h2>
        <form
          className={styles.form}
          onSubmit={ciudadano ? handleSubmit : handleBuscar}
        >
          <label className={styles.label}>C.I.</label>
          <div className={styles.ciRow}>
            <input
              name="ci"
              className={styles.input}
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              required
              disabled={!!ciudadano}
            />
            <button type="submit" className={styles.iconButton}>
              <FaSearch />
            </button>
          </div>

          {ciudadano && (
            <>
              <label className={styles.label}>Nombre</label>
              <div className={styles.inputRow}>
                <input
                  name="nombre"
                  defaultValue={ciudadano.nombre}
                  className={styles.input}
                  required
                  disabled={!editFields.nombre}
                />
                <FaPen
                  className={styles.editIcon}
                  onClick={() => habilitarCampo("nombre")}
                />
              </div>

              <label className={styles.label}>Apellido</label>
              <div className={styles.inputRow}>
                <input
                  name="apellido"
                  defaultValue={ciudadano.apellido}
                  className={styles.input}
                  required
                  disabled={!editFields.apellido}
                />
                <FaPen
                  className={styles.editIcon}
                  onClick={() => habilitarCampo("apellido")}
                />
              </div>

              <label className={styles.label}>Credencial cívica - Serie</label>
              <div className={styles.inputRow}>
                <input
                  name="serie"
                  defaultValue={ciudadano.serie}
                  className={styles.input}
                  required
                  disabled={!editFields.serie}
                />
                <FaPen
                  className={styles.editIcon}
                  onClick={() => habilitarCampo("serie")}
                />
              </div>

              <label className={styles.label}>Credencial cívica - Nº</label>
              <div className={styles.inputRow}>
                <input
                  name="numero"
                  defaultValue={ciudadano.numero}
                  className={styles.input}
                  required
                  disabled={!editFields.numero}
                />
                <FaPen
                  className={styles.editIcon}
                  onClick={() => habilitarCampo("numero")}
                />
              </div>

              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={handleEliminar}
                >
                  <FaTrashAlt /> Eliminar ciudadano
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

export default EditarCiudadano;
