import React, { useRef, useState, useEffect } from "react";
import styles from "./EditarPolicia.module.css";
import { FaSearch, FaTrashAlt, FaPen } from "react-icons/fa";
import adminService from "../../../services/adminServices";

function EditarPolicia({ onClose }) {
  const overlayRef = useRef();
  const [ci, setCI] = useState("");
  const [policia, setPolicia] = useState("");
  const [editFields, setEditFields] = useState({
    comisaria: false,
    establecimiento: false
  });
  const [establecimientos, setEstablecimientos] = useState([]);
  const [comisarias, setComisarias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaComisaria, setBusquedaComisaria] = useState("");
  const [comisaria, setComisaria] = useState("");
  const [establecimiento, setEstablecimiento] = useState();

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const data = await adminService.getPoliciaByCi(token, ci);
      if (data) {
        setPolicia({
          id: data.id_policia,
          ci: data.ci_ciudadano,
          id_comisaria: data.id_comisaria,
          id_establecimiento: data.id_establecimiento
        });
        setComisaria(data.id_comisaria);
        setEstablecimiento(data.id_establecimiento);
        console.log("Policía encontrado:", data);
      } else {
        alert("Policía no encontrado");
      }
    } catch (error) {
      alert("Error al buscar policía");
      console.error("Error buscando policía:", error);
    }
  };

  const habilitarCampo = (campo) => {
    setEditFields((prev) => ({ ...prev, [campo]: true }));
  };

  const hayCambios = Object.values(editFields).some((v) => v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {};
    if (editFields.comisaria) payload.id_comisaria = comisaria;
    if (editFields.establecimiento) payload.id_establecimiento = establecimiento;

    if (Object.keys(payload).length === 0) {
      alert("No realizaste ningún cambio.");
      return;
    }

    try {
      await adminService.updatePolicia(token, policia.id, payload);
      onClose();
    } catch (error) {
      console.error("Error al actualizar policía:", error);
      alert("Error al actualizar policía. Intentalo nuevamente.");
    }
  };


  const handleEliminar = () => {
    console.log("Eliminar policía con CI:", ci);
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
            {!policia && (
              <button type="submit" className={styles.iconButton}>
                <FaSearch />
              </button>
            )}
          </div>

          {policia && (
            <>
              <label className={styles.label}>Comisaría</label>
              <div className={styles.inputRow}>
                {editFields.comisaria ? (
                  <div className="field is-fullwidth" style={{ flex: 1 }}>
                    <input
                      className="input mb-2 is-rounded"
                      type="text"
                      placeholder="Buscar..."
                      value={busquedaComisaria}
                      onChange={(e) => setBusquedaComisaria(e.target.value)}
                    />
                    <div className="select is-fullwidth is-rounded">
                      <select
                        name="comisaria"
                        value={comisaria || ""}
                        onChange={(e) => setComisaria(Number(e.target.value))}
                        required
                      >
                        <option value="" disabled>Seleccionar...</option>
                        {comisariasFiltradas.map((com) => (
                          <option key={com.id} value={com.id}>
                            Comisaría {com.numero}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <input
                    name="comisaria"
                    value={
                      comisarias.find((c) => c.id === comisaria)?.numero || ""
                    }
                    className={styles.input}
                    disabled
                    required
                  />
                )}
                <FaPen className={styles.editIcon} onClick={() => habilitarCampo("comisaria")} />
              </div>
              <label className={styles.label}>Establecimiento</label>
              <div className={styles.inputRow}>
                {editFields.establecimiento ? (
                  <div className="field is-fullwidth" style={{ flex: 1 }}>
                    <input
                      className="input mb-2 is-rounded"
                      type="text"
                      placeholder="Buscar..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <div className="select is-fullwidth is-rounded">
                      <select
                        name="establecimiento"
                        value={establecimiento || ""}
                        onChange={(e) => setEstablecimiento(Number(e.target.value))}
                        required
                      >
                        <option value="" disabled>Seleccionar...</option>
                        {establecimientosFiltrados.map((est) => (
                          <option key={est.id_est} value={est.id_est}>
                            {est.nombre_est} - {est.ciudad} - {est.departamento}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <input
                    name="establecimiento"
                    value={
                      establecimientos.find((e) => e.id_est === establecimiento)
                        ? `${establecimientos.find((e) => e.id_est === establecimiento).nombre_est} - ${establecimientos.find((e) => e.id_est === establecimiento).ciudad}, ${establecimientos.find((e) => e.id_est === establecimiento).departamento}`
                        : ""
                    }
                    className={styles.input}
                    disabled
                    required
                  />
                )}
                <FaPen className={styles.editIcon} onClick={() => habilitarCampo("establecimiento")} />
              </div>
              <div className={styles.actionRow}>
                <button
                  type="button"
                  className="button is-danger is-rounded has-text-white"
                  style={{gap:"3px"}}
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

        <button className={`${styles.closeButton} delete has-background-link`} onClick={onClose}/>
      </div>
    </div>
  );
}

export default EditarPolicia;
