// NuevoCiudadano.jsx
import React, { useRef, useState, useEffect } from "react";
import styles from "./NuevoPolicia.module.css";
import adminService from "../../../services/adminServices";

function NuevoPolicia({ onClose }) {
  const overlayRef = useRef();
  const [establecimientos, setEstablecimientos] = useState([]);
  const [comisarias, setComisarias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [ci, setCi] = useState("");
  const [busquedaComisaria, setBusquedaComisaria] = useState("");
  const [comisaria, setComisaria] = useState("");
  const [establecimiento, setEstablecimiento] = useState();

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ci.trim()) {
      alert("El número de cédula es obligatorio.");
      return;
    }

    if (isNaN(ci)) {
      alert("El número de cédula debe ser un número válido.");
      return;
    }

    if (!establecimiento) {
      alert("Debes seleccionar un establecimiento.");
      return;
    }
    if (!comisaria) {
      alert("Debes seleccionar una comisaría.");
      return;
    }

    const policia = {
      ci: Number(ci),
      comisaria: Number(comisaria),
      establecimiento: Number(establecimiento)
    };
    console.log("Nuevo policia:", policia);
    adminService.crearPolicia(
      localStorage.getItem("token"),
      policia.ci,
      policia.comisaria,
      policia.establecimiento
    )
    onClose();
  };

  useEffect(() => {
    const fetchEstablecimientosComisarias = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await adminService.getEstablecimientos(token);
        setEstablecimientos([...data]);
        const data2 = await adminService.getComisarias(token);
        setComisarias([...data2]);
        console.log("Establecimientos traídos:", [...data]);
        console.log("Comisarias traídas:", [...data2]);
      } catch (error) {
        console.error("Error al traer los establecimientos:", error);
      }
    };

    fetchEstablecimientosComisarias();
  }, []);

  const establecimientosFiltrados = establecimientos.filter(
    (est) =>
      est?.nombre_est?.toLowerCase().includes(busqueda.toLowerCase()) ||
      est?.ciudad?.toLowerCase().includes(busqueda.toLowerCase()) ||
      est?.departamento?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const comisariasFiltradas = comisarias.filter(
    (comisaria) =>
      comisaria?.numero.toString().includes(busquedaComisaria)
  );

  return (
    <div className={styles.modalOverlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Añadir Policía</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>CI</label>
          <input
            className={styles.input}
            type="text"
            value={ci}
            onChange={(e) => setCi(e.target.value)}
            required
          />
          <label className="label">Comisaría</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Buscar..."
              value={busquedaComisaria}
              onChange={(e) => setBusquedaComisaria(e.target.value)}
            />
          </div>
          <div className="control mt-2">
            <div className="select is-fullwidth">
              <select
                value={comisaria || ""}
                onChange={(e) => setComisaria(Number(e.target.value))}
              >
                <option value="" disabled>
                  Seleccionar...
                </option>
                {comisariasFiltradas.map((com) => (
                  <option key={com.id} value={com.id}>
                    {com.numero}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <label className="label">Establecimiento</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="control mt-2">
            <div className="select is-fullwidth">
              <select
                value={establecimiento || ""}
                onChange={(e) => setEstablecimiento(Number(e.target.value))}
              >
                <option value="" disabled>
                  Seleccionar...
                </option>
                {establecimientosFiltrados.map((est) => (
                  <option key={est.id_est} value={est.id_est}>
                    {est.nombre_est} - {est.ciudad} - {est.departamento}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.buttonRow}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.submitButton}>Añadir Policía</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoPolicia;
