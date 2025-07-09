import React, { useRef, useEffect, useState } from "react";
import styles from "./NuevoCiudadano.module.css";
import adminService from "../../../services/adminServices";

function NuevoCiudadano({ onClose }) {
  const overlayRef = useRef();
  const [circuito, setCircuito] = React.useState("");
  const [circuitos, setCircuitos] = React.useState([]);
  const [busqueda, setBusqueda] = React.useState("");

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    const fetchCircuitos = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await adminService.getCircuitos(token);
        setCircuitos([...data]);
        console.log("Circuitos traídos:", [...data]);
      } catch (error) {
        console.error("Error al traer los circuitos:", error);
      }
    };

    fetchCircuitos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const token = localStorage.getItem("token");

    try {
      await adminService.crearCiudadano(
        token,
        data.ci,
        data.nombre,
        data.apellido,
        data.serie,
        data.numero,
        circuito // estado del select
      );
      alert("Ciudadano añadido exitosamente");
      onClose();
    } catch (error) {
      alert("Error al añadir ciudadano: " + error.message);
    }
  };


  const circuitosFiltrados = circuitos.filter(
      (cir) =>
        cir?.nro?.toString().toLowerCase().includes(busqueda.toLowerCase())
    );

  return (
    <div className={styles.modalOverlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Añadir Ciudadano</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            C.I.
            <input name="ci" type="text" className={styles.input} required />
          </label>
          <label>
            Nombre
            <input name="nombre" type="text" className={styles.input} required />
          </label>
          <label>
            Apellido
            <input name="apellido" type="text" className={styles.input} required />
          </label>
          <label>
            Serie Credencial
            <input name="serie" type="text" className={styles.input} required />
          </label>
          <label>
            Nº Credencial
            <input name="numero" type="text" className={styles.input} required />
          </label>
          <div className="control">
            <label>Circuito</label>
            <input
              className="input is-rounded"
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <div className="select is-fullwidth is-rounded mt-1">
              <select
                value={circuito || ""}
                onChange={(e) => setCircuito(Number(e.target.value))}
              >
                <option value="" disabled>
                  Seleccionar...
                </option>
                {circuitosFiltrados.map((cir) => (
                  <option key={cir.nro} value={cir.nro}>
                    {cir.nro}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.buttonRow}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>

            <button type="submit" className={styles.submitButton}>Añadir Ciudadano</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoCiudadano;
