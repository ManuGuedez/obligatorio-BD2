// EditarPartido.jsx
import React, { useRef, useState } from "react";
import styles from "./EditarPartido.module.css";
import { FaSearch, FaTrashAlt, FaPen } from "react-icons/fa";
import adminService from "../../../services/adminServices";

function EditarPartido({ onClose }) {
  const overlayRef = useRef();
  const [partidoEncontrado, setPartidoEncontrado] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [idPartido, setIdPartido] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    calle: "",
    numero: "",
    telefono: "",
    codPostal: "",
    presidente: "",
    vice: "",
    color: "#cccccc"
  });

  const [editFields, setEditFields] = useState({
    nombre: false,
    calle: false,
    numero: false,
    telefono: false,
    codPostal: false,
    presidente: false,
    vice: false,
    color: false
  });

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const habilitarCampo = (campo) => {
    setEditFields(prev => ({ ...prev, [campo]: true }));
  };

  const hayCambios = Object.values(editFields).some(Boolean);

  const handleBuscar = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const encodedNombre = encodeURIComponent(busqueda.trim());
      const data = await adminService.getPartidoByNombre(token, encodedNombre);
      console.log("Partido encontrado:", data);

      setFormData({
        nombre: data.nombre,
        calle: data.calle,
        numero: data.numero,
        telefono: data.telefono,
        codPostal: data.codigo_postal,
        presidente: data.ci_presidente,
        vice: data.ci_vicepresidente,
        color: data.color || "#cccccc"
      });
      setIdPartido(data.id);
      setPartidoEncontrado(true);
    } catch (error) {
      alert("No se pudo encontrar el partido.");
      console.error("Error al buscar partido:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      ...(editFields.nombre && { nombre: formData.nombre }),
      ...(editFields.calle && { calle: formData.calle }),
      ...(editFields.numero && { numero: formData.numero }),
      ...(editFields.telefono && { telefono: formData.telefono }),
      ...(editFields.codPostal && { codigo_postal: formData.codPostal }),
      ...(editFields.presidente && { ci_presidente: formData.presidente }),
      ...(editFields.vice && { ci_vicepresidente: formData.vice }),
      ...(editFields.color && { color: formData.color }),
    };

    if (Object.keys(payload).length === 0) {
      alert("No realizaste ningún cambio.");
      return;
    }

    try {
      await adminService.updatePartido(token, idPartido, payload);
      alert("Partido actualizado correctamente.");
      onClose();
    } catch (error) {
      console.error("Error al actualizar el partido:", error);
      alert("Error al actualizar el partido.");
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Editar información de un partido</h2>
        <form className={styles.form} onSubmit={partidoEncontrado ? handleSubmit : handleBuscar}>
          {!partidoEncontrado && (
            <div className={styles.searchRow}>
              <input
                name="busqueda"
                className={styles.searchInput}
                placeholder="Nombre del partido"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button type="submit" className={styles.iconButton}>
                <FaSearch />
              </button>
            </div>
          )}

          {partidoEncontrado && (
            <>
              {["nombre", "calle", "numero", "telefono", "codPostal", "presidente", "vice"].map((campo) => (
                <div key={campo}>
                  <label className={styles.label}>{campo[0].toUpperCase() + campo.slice(1)}</label>
                  <div className={styles.inputRow}>
                    <input
                      name={campo}
                      className={styles.input}
                      value={formData[campo]}
                      onChange={handleChange}
                      disabled={!editFields[campo]}
                    />
                    <FaPen className={styles.editIcon} onClick={() => habilitarCampo(campo)} />
                  </div>
                </div>
              ))}

              <label className={styles.label}>Color</label>
              <div className={styles.inputRow}>
                <input
                  name="color"
                  type="color"
                  value={formData.color}
                  className={styles.input}
                  onChange={handleChange}
                  disabled={!editFields.color}
                />
                <FaPen className={styles.editIcon} onClick={() => habilitarCampo("color")} />
              </div>

              <div className={styles.buttonRow}>
                <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                {hayCambios && (
                  <button type="submit" className={styles.saveButton}>
                    Guardar cambios
                  </button>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditarPartido;