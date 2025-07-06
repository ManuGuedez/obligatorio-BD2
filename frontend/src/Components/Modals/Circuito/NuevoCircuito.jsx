import React, { useRef, useState, useEffect } from "react";
import styles from "./NuevoCircuito.module.css";
import adminService from "../../../services/adminServices";


function NuevoCircuito({ onClose, setModal }) {
  const overlayRef = useRef();
  const [accesible, setAccesible] = useState(false);
  const [establecimiento, setEstablecimiento] = useState();
  const [numero, setNumero] = useState("");
  const [establecimientos, setEstablecimientos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!numero.trim()) {
      alert("El número de circuito es obligatorio.");
      return;
    }

    if (isNaN(numero)) {
      alert("El número de circuito debe ser un número válido.");
      return;
    }

    if (!establecimiento) {
      alert("Debes seleccionar un establecimiento.");
      return;
    }

    const circuito = {
      numero: Number(numero),
      accesible,
      establecimiento: Number(establecimiento)
    };
    console.log("Nuevo circuito:", circuito);
    adminService.crearCircuito(
      localStorage.getItem("token"),
      circuito.numero,
      circuito.accesible,
      circuito.establecimiento
    )
    onClose();
  };

  const handleCrearEstablecimiento = () => {
    onClose(); // cerramos el modal actual
    setTimeout(() => setModal("nuevoEstablecimiento"), 100); // abrimos el nuevo modal
  };

  useEffect(() => {
    const fetchEstablecimientos = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await adminService.getEstablecimientos(token);
        setEstablecimientos([...data]);
        console.log("Establecimientos traídos:", [...data]);
      } catch (error) {
        console.error("Error al traer los establecimientos:", error);
      }
    };

    fetchEstablecimientos();
  }, []);

    const establecimientosFiltrados = establecimientos.filter(
      (est) =>
        est?.nombre_est?.toLowerCase().includes(busqueda.toLowerCase()) ||
        est?.ciudad?.toLowerCase().includes(busqueda.toLowerCase()) ||
        est?.departamento?.toLowerCase().includes(busqueda.toLowerCase())
    );

  return (
    <div ref={overlayRef} className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Nuevo Circuito</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>N° Circuito</label>
          <input
            className={styles.input}
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
          />

          <label className={styles.label}>Accesibilidad</label>
          <div
            className={`${styles.switch} ${accesible ? styles.on : styles.off}`}
            onClick={() => setAccesible((prev) => !prev)}
          >
            <div className={styles.knob}></div>
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

          <p className={styles.subLink} onClick={handleCrearEstablecimiento}>
            ¿No encontrás el establecimiento? Crear uno
          </p>

          <div className={styles.buttonRow}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.submitButton}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoCircuito;
