import React, { useRef, useState, useEffect } from "react";
import styles from "./EditarCiudadano.module.css";
import { FaSearch, FaTrashAlt, FaPen } from "react-icons/fa";
import adminService from "../../../services/adminServices";

function EditarCiudadano({ onClose }) {
  const overlayRef = useRef();
  const [ci, setCi] = useState("");
  const [ciudadano, setCiudadano] = useState(null);
  const [editFields, setEditFields] = useState({
    nombre: false,
    apellido: false,
    serie: false,
    numero: false,
    circuito: false,
  });
  const [circuito, setCircuito] = useState();
  const [circuitos, setCircuitos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const data = await adminService.getCiudadanoByCi(token, ci);
      if (data) {
        setCiudadano({
          nombre: data.nombre,
          apellido: data.apellido,
          serie: data.serie_credencial,
          numero: data.nro_credencial,
        });
        setCircuito(data.nro_circuito); // 👈 guardás el circuito actual
      } else {
        alert("Ciudadano no encontrado");
      }
    } catch (error) {
      alert("Error al buscar ciudadano");
      console.error("Error buscando ciudadano:", error);
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

  const habilitarCampo = (campo) => {
    setEditFields((prev) => ({ ...prev, [campo]: true }));
  };

  const circuitosFiltrados = circuitos.filter(
    (cir) =>
      cir?.nro?.toString().toLowerCase().includes(busqueda.toLowerCase())
  );

  const hayCambios = Object.values(editFields).some((v) => v);

  const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      formData.append("ci", ci);
      const data = Object.fromEntries(formData);
      const token = localStorage.getItem("token");

      const payload = {};

      if (editFields.nombre) {
          payload.nombre = data.nombre;
      }
      if (editFields.apellido) {
          payload.apellido = data.apellido;
      }
      if (editFields.serie) {
          payload.serie = data.serie;
      }
      if (editFields.numero) {
          payload.numero = data.numero;
      }
      if (editFields.circuito) {
          const circuitoValue = parseInt(data.circuito);
          if (!isNaN(circuitoValue)) {
              payload.circuito = circuitoValue;
          }
      }
      try {
          await adminService.updateCiudadano(token, ci, payload.nombre, payload.apellido, payload.serie, payload.numero, payload.circuito);
          console.log("Ciudadano actualizado correctamente");
          onClose();
      } catch (error) {
          console.error("Error al actualizar ciudadano:", error);
          alert("Error al actualizar ciudadano. Intentalo nuevamente.");
          onClose();
      }
  };

const handleEliminar = async () => {
  const confirmacion = window.confirm("¿Estás seguro de que querés eliminar este ciudadano?");
  if (!confirmacion) return;

  const token = localStorage.getItem("token");

  try {
    await adminService.deleteCiudadano(token, ci);
    alert("Ciudadano eliminado correctamente.");
    onClose();
  } catch (error) {
    console.error("Error eliminando ciudadano:", error);
    alert("Error al eliminar el ciudadano. Verificá si está asociado a otros registros.");
  }
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
              <label className={styles.label}>Circuito</label>
              <div className={styles.inputRow}>
                {editFields.circuito ? (
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
                        name="circuito"
                        value={circuito || ""}
                        onChange={(e) => setCircuito(Number(e.target.value))}
                        required
                      >
                        <option value="" disabled>Seleccionar...</option>
                          {circuitosFiltrados.map((cir) => (
                            <option key={cir.nro} value={cir.nro}>
                              {cir.nro}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      name="circuito"
                      defaultValue={circuito}
                      className={styles.input}
                      disabled
                      required
                    />
                  </>
                )}
                <FaPen className={styles.editIcon} onClick={() => habilitarCampo("circuito")} />
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
