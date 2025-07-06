// NuevoMiembro.jsx
import React, { useRef, useState, useEffect } from "react";
import styles from "./NuevoMiembro.module.css";
import adminService from "../../../services/adminServices";

function NuevoMiembro({ onClose }) {
  const overlayRef = useRef();
  const [ci, setCi] = useState("");
  const [circuito, setCircuito] = useState("");
  const [organismo, setOrganismo] = useState("");
  const [rol, setRol] = useState("");
  const [organismos, setOrganismos] = useState([]);
  const [circuitos, setCircuitos] = useState([]);
  const [roles, setRoles] = useState([]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const datos = {
      ci,
      circuito,
      organismo,
      rol,
    };
    console.log("Nuevo miembro de mesa:", datos);
    onClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await adminService.getOrganismosPublicos(token);
        setOrganismos([...data]);
        const data2 = await adminService.getCircuitos(token);
        setCircuitos([...data2]);
        const data3 = await adminService.getRoles(token);
        setRoles([...data3]);
        console.log("Organismos traídos:", [...data]);
        console.log("Circuitos traídas:", [...data2]);
        console.log("Roles traídos:", [...data3]);
      } catch (error) {
        console.error("Error al traer los datos:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className={styles.modalOverlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h2 className={styles.title}>Nuevo Miembro de Mesa</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>Cédula</label>
          <input
            type="text"
            className={styles.input}
            value={ci}
            onChange={(e) => setCi(e.target.value)}
            required
          />

          <label className={styles.label}>N.º de Circuito</label>
          <input
            type="number"
            className={styles.input}
            value={circuito}
            onChange={(e) => setCircuito(e.target.value)}
            required
          />

          <label className={styles.label}>Organismo Público</label>
          <select
            className={styles.select}
            value={organismo}
            onChange={(e) => setOrganismo(e.target.value)}
            required
          >
            <option value="" disabled>Seleccionar...</option>
            <option value="mtop">MTOP</option>
            <option value="mec">MEC</option>
            <option value="msp">MSP</option>
          </select>

          <label className={styles.label}>Rol en la Mesa</label>
          <select
            className={styles.select}
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
          >
            <option value="" disabled>Seleccionar...</option>
            <option value="presidente">Presidente</option>
            <option value="secretario">Secretario</option>
            <option value="vocal">Vocal</option>
          </select>

          <div className={styles.buttonRow}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoMiembro;
