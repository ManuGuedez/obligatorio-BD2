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
  const [busquedaCircuito, setBusquedaCircuito] = useState("");
  const [busquedaOrganismo, setBusquedaOrganismo] = useState("");
  const [busquedaRol, setBusquedaRol] = useState("");


  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const payload = {
      id_organismo: Number(organismo),
      ci,
      nro_circuito: Number(circuito),
      id_rol: Number(rol),
    };

    try {
      await adminService.agregarMiembro(token, payload);
      alert("Miembro de mesa creado correctamente.");
      onClose();
    } catch (error) {
      console.error("Error al crear miembro de mesa:", error);
      alert("Error al crear el miembro. Verificá los datos e intentá nuevamente.");
    }
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

          <label className={styles.label}>Circuito</label>
          <input
            className="input mb-2"
            type="text"
            placeholder="Buscar..."
            value={busquedaCircuito}
            onChange={(e) => setBusquedaCircuito(e.target.value)}
          />
          <div className="select is-fullwidth">
            <select
              className={styles.select}
              value={circuito}
              onChange={(e) => setCircuito(e.target.value)}
              required
            >
              <option value="" disabled>Seleccionar...</option>
              {circuitos
                .filter((c) => c.nro.toString().includes(busquedaCircuito))
                .map((c) => (
                  <option key={c.nro} value={c.nro}>
                    Circuito {c.nro}
                  </option>
                ))}
            </select>
          </div>

          <label className={styles.label}>Organismo Público</label>
          <input
            className="input mb-2"
            type="text"
            placeholder="Buscar..."
            value={busquedaOrganismo}
            onChange={(e) => setBusquedaOrganismo(e.target.value)}
          />
          <div className="select is-fullwidth">
            <select
              className={styles.select}
              value={organismo}
              onChange={(e) => setOrganismo(e.target.value)}
              required
            >
              <option value="" disabled>Seleccionar...</option>
              {organismos
                .filter((o) =>
                  o.descripcion.toLowerCase().includes(busquedaOrganismo.toLowerCase())
                )
                .map((o) => (
                  <option key={o.id_organismo} value={o.id_organismo}>
                    {o.descripcion}
                  </option>
                ))}
            </select>
          </div>


          <label className={styles.label}>Rol en la Mesa</label>
          <input
            className="input mb-2"
            type="text"
            placeholder="Buscar..."
            value={busquedaRol}
            onChange={(e) => setBusquedaRol(e.target.value)}
          />
          <div className="select is-fullwidth">
            <select
              className={styles.select}
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              required
            >
              <option value="" disabled>Seleccionar...</option>
              {roles
                .filter((r) =>
                  r.rol.toLowerCase().includes(busquedaRol.toLowerCase())
                )
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.rol}
                  </option>
                ))}
            </select>
          </div>
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
