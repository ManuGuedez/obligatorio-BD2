// EditarCircuito.jsx
import React, { useRef, useState, useEffect } from "react";
import styles from "./EditarCircuito.module.css";
import { FaSearch, FaPen, FaTrashAlt } from "react-icons/fa";
import adminService from "../../../services/adminServices";

function EditarCircuito({ onClose }) {
  const overlayRef = useRef();
  const [numero, setNumero] = useState("");
  const [circuito, setCircuito] = useState(null);
  const [editFields, setEditFields] = useState({
    accesible: false,
    establecimiento: false,
  });
  const[busqueda, setBusqueda] = useState("");
  const [establecimiento, setEstablecimiento] = useState();
  const [establecimientos, setEstablecimientos] = useState([]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const fetchCircuito = async (e) => {
    e.preventDefault();
    console.log("Ejecutando fetchCircuito con número:", numero);
    try {
      const token = localStorage.getItem("token");
      const data = await adminService.getCircuitoById(token, numero);
      console.log("Respuesta del backend:", data);
      setCircuito(data);
    } catch (error) {
      console.error("Error al traer el circuito:", error);
    }
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

  const habilitarCampo = (campo) => {
    setEditFields((prev) => ({ ...prev, [campo]: true }));
  };

  const hayCambios = Object.values(editFields).some((v) => v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("numero", numero);
    const data = Object.fromEntries(formData);

    const token = localStorage.getItem("token");
    const nroInt = parseInt(data.numero);

    // Construimos un objeto solo con los campos editados
    const payload = {};

    if (editFields.accesible) {
      payload.es_accesible = data.accesible === "true";
    }

    if (editFields.establecimiento) {
      const estId = parseInt(data.establecimiento);
      if (!isNaN(estId)) {
        payload.id_establecimiento = estId;
      }
    }

    console.log("Payload enviado:", payload);

    try {
      await adminService.updateCircuito(token, nroInt, payload.es_accesible, payload.id_establecimiento);
      console.log("Actualización exitosa");
      onClose();
    } catch (error) {
      console.error("Error al actualizar circuito:", error);
    }
  };


  const handleEliminar = async () => {
    if (!confirmacion) return;

    const token = localStorage.getItem("token");

    try {
      await adminService.deleteCircuito(token, numero);
      onClose();
    } catch (error) {
      console.error("Error eliminando circuito:", error);
    }
  };


  return (
    <div className={styles.modalOverlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Editar información de un circuito</h2>
        <form className={styles.form} onSubmit={circuito ? handleSubmit : fetchCircuito}>
          <label className={styles.label}>N° Circuito</label>
          <div className={styles.inputRow}>
            <input
              name="numero"
              className={styles.input}
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
              disabled={!!circuito}
            />
            {!circuito && 
            (<button type="submit" className={styles.iconButton}>
              <FaSearch />
            </button>)
            }
          </div>

          {circuito && (
            <>
              <label className={styles.label}>Accesibilidad</label>
              <div className={styles.inputRow}>
                <select
                  name="accesible"
                  className={styles.input}
                  defaultValue={circuito.es_accesible ? "true" : "false"}
                  disabled={!editFields.accesible}
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
                <FaPen className={styles.editIcon} onClick={() => habilitarCampo("accesible")} />
              </div>

              <label className={styles.label}>Establecimiento</label>
              <div className={styles.inputRow}>
                {editFields.establecimiento ? (
                  <div className="field is-fullwidth" style={{ flex: 1 }}>
                    <input
                      className="input mb-2"
                      type="text"
                      placeholder="Buscar..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <div className="select is-fullwidth">
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
                  <>
                    <input
                      name="establecimiento"
                      defaultValue={circuito.establecimiento_nombre}
                      className={styles.input}
                      disabled
                      required
                    />
                  </>
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
                  <FaTrashAlt /> Eliminar circuito
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

export default EditarCircuito;
