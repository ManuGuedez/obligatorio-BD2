import React, { useRef, useState } from "react";
import styles from "./EditarPartido.module.css";
import { FaSearch, FaTrashAlt, FaPen } from "react-icons/fa";

function EditarPartido({ onClose }) {
  const overlayRef = useRef();
  const [id, setID] = useState("");
  const [partido, setPartido] = useState(null);
  const [editFields, setEditFields] = useState({
    nombre: false,
    calle: false,
    numero: false,  
    telefono: false,
    codPostal: false,
    presidente: false,
    vice: false,
  });

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    if (id === "10") {
      // Simulación de búsqueda exitosa
      setPartido({
        id: "10",
        nombre: "Partido BD",
        calle: "Calle Falsa",
        numero: "123",
        telefono: "123456789",
        codPostal: "12345",
        presidenteCI: "11111111",
        vicepresidenteCI: "22222222"
      });
    } else {
      alert("Partido no encontrado (simulado)");
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
    console.log("Actualizando partido:", data);
    onClose();
  };

  const handleEliminar = () => {
    console.log("Eliminar partido con ID:", id);
    onClose();
  };

  return (
    <div
      className={styles.modalOverlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Editar información de un partido</h2>
        <form
          className={styles.form}
          onSubmit={partido ? handleSubmit : handleBuscar}
        >
          <label className={styles.label}>ID</label>
          <div className={styles.ciRow}>
            <input
              name="id"
              className={styles.input}
              value={id}
              onChange={(e) => setID(e.target.value)}
              required
              disabled={!!partido}
            />
            <button type="submit" className={styles.iconButton}>
              <FaSearch />
            </button>
          </div>

          {partido && (
            <>
              <label className={styles.label}>Nombre</label>
              <div className={styles.inputRow}>
                <input
                  name="nombre"
                  defaultValue={partido.nombre}
                  className={styles.input}
                  required
                  disabled={!editFields.nombre}
                />
                <FaPen
                  className={styles.editIcon}
                  onClick={() => habilitarCampo("nombre")}
                />
              </div>
              <label className={styles.label}>Calle</label>
              <div className={styles.inputRow}>
                <input
                  name="calle"
                  defaultValue={partido.calle}
                  className={styles.input}
                  required
                  disabled={!editFields.calle}
                />
                <FaPen
                  className={styles.editIcon}
                  onClick={() => habilitarCampo("calle")}
                />
              </div>
              <label className={styles.label}>Número</label>
              <div className={styles.inputRow}>
                <input
                  name="numero"
                  defaultValue={partido.numero}
                  className={styles.input}
                  required
                  disabled={!editFields.numero}
                />
                <FaPen
                  className={styles.editIcon}
                  onClick={() => habilitarCampo("numero")}
                />
              </div>
              <label className={styles.label}>Código Postal</label>
              <div className={styles.inputRow}>
                <input
                  name="codPostal"
                  defaultValue={partido.codPostal}
                  className={styles.input}
                  required
                  disabled={!editFields.codPostal}
                />
                <FaPen
                  className={styles.editIcon}
                  onClick={() => habilitarCampo("codPostal")}
                />
              </div>
              <label className={styles.label}>Teléfono</label>
              <div className={styles.inputRow}>
                <input
                  name="telefono"
                  defaultValue={partido.telefono}
                  className={styles.input}
                  required
                  disabled={!editFields.telefono}
                />
                <FaPen
                  className={styles.editIcon}
                  onClick={() => habilitarCampo("telefono")}
                />
              </div>
              <label className={styles.label}>CI presidente</label>
              <div className={styles.inputRow}>
                <input
                  name="presidente"
                  defaultValue={partido.presidente}
                  className={styles.input}
                  required
                  disabled={!editFields.presidente}
                />
                <FaPen
                  className={styles.editIcon}
                  onClick={() => habilitarCampo("presidente")}
                />
              </div>
              <label className={styles.label}>Vicepresidente</label>
              <div className={styles.inputRow}>
                <input
                  name="vice"
                  defaultValue={partido.vice}
                  className={styles.input}
                  required
                  disabled={!editFields.vice}
                />
                <FaPen
                  className={styles.editIcon}
                  onClick={() => habilitarCampo("vice")}
                />
              </div>
              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={handleEliminar}
                >
                  <FaTrashAlt /> Eliminar partido
                </button>
                { hayCambios && (
                  <button type="submit" className={styles.deleteButton}>
                    Guardar cambios
                  </button>
                )}
              </div>
            </>
          )}
        </form>

        <button className={`${styles.closeButton} delete has-background-link`} onClick={onClose}/>
      </div>
    </div>
  );
}

export default EditarPartido;
