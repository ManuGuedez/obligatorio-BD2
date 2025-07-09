// EditarMiembro.jsx
import React, { useRef, useState, useEffect } from "react";
import styles from "./EditarMiembro.module.css";
import { FaSearch, FaPen, FaTrashAlt } from "react-icons/fa";
import adminService from "../../../services/adminServices";

function EditarMiembro({ onClose }) {
  const overlayRef = useRef();
  const [ci, setCi] = useState("");
  const [miembro, setMiembro] = useState(null);
  const [editFields, setEditFields] = useState({
    circuito: false,
    organismo: false,
    rol: false,
  });
  const [circuitos, setCircuitos] = useState([]);
  const [roles, setRoles] = useState([]);
  const [busquedaCircuito, setBusquedaCircuito] = useState("");
  const [busquedaRol, setBusquedaRol] = useState("");
  const [circuitoSelected, setCircuitoSelected] = useState("");
  const [rolSelected, setRolSelected] = useState("");

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const data = await adminService.getMiembroByCi(token, ci);
      if (data) {
        setMiembro({
          id: data.id_miembro,
          nombre: data.nombre,
          apellido: data.apellido,
          circuito: data.nro_circuito,
          rol: data.rol_en_mesa,
        });
        setCircuitoSelected(data.nro_circuito);
        setRolSelected(data.id_rol);
      } else {
        alert("Miembro no encontrado");
      }
    } catch (error) {
      alert("Error al buscar miembro");
      console.error("Error buscando miembro:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
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

  const habilitarCampo = (campo) => {
    setEditFields((prev) => ({ ...prev, [campo]: true }));
  };

  const hayCambios = Object.values(editFields).some(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const circuitoFinal = editFields.circuito ? circuitoSelected : miembro.circuito;

    let idRolFinal;
    if (editFields.rol) {
      idRolFinal = Number(rolSelected);
    } else {
      const rolObj = roles.find((r) =>
        r.descripcion.trim().toLowerCase() === miembro.rol.trim().toLowerCase()
      );
      if (!rolObj) {
        alert("No se pudo encontrar el ID del rol actual.");
        return;
      }
      idRolFinal = rolObj.id;
    }

    const payload = {
      nro_circuito: circuitoFinal,
      id_rol: idRolFinal,
    };

    try {
      await adminService.updateMiembro(token, miembro.id, payload);
      alert("Miembro actualizado correctamente.");
      onClose();
    } catch (error) {
      console.error("Error actualizando miembro:", error);
      alert("Error al actualizar miembro. Verificá los datos.");
    }
  };

  const handleEliminar = () => {
    console.log("Miembro de mesa eliminado:", ci);
    onClose();
  };

  return (
    <div
      className={styles.modalOverlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h2 className={styles.title}>Editar Miembro de Mesa</h2>

        <form className={styles.form} onSubmit={miembro ? handleSubmit : handleBuscar}>
          <label className={styles.label}>Cédula</label>
          <div className={styles.inputRow}>
            <input
              name="ci"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              className={styles.input}
              required
              disabled={!!miembro}
            />
            {
              !miembro &&
              <button type="submit" className={styles.iconButton}>
                <FaSearch />
              </button>
            }
          </div>

          {miembro && (
            <>
              <label className={styles.label}>N.º de Circuito</label>
              <div className={styles.inputRow}>
                {editFields.circuito ? (
                  <div style={{ flex: 1 }}>
                    <input
                      className="input mb-2 is-rounded"
                      type="text"
                      placeholder="Buscar..."
                      value={busquedaCircuito}
                      onChange={(e) => setBusquedaCircuito(e.target.value)}
                    />
                    <div className="select is-fullwidth is-rounded">
                      <select
                        name="circuito"
                        value={circuitoSelected}
                        onChange={(e) => setCircuitoSelected(Number(e.target.value))}
                        required
                      >
                        <option value="" disabled>Seleccionar...</option>
                        {circuitos
                          .filter((c) =>
                            c.nro.toString().includes(busquedaCircuito)
                          )
                          .map((c) => (
                            <option key={c.nro} value={c.nro}>
                              Circuito {c.nro}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <input
                    name="circuito"
                    value={miembro.circuito}
                    className={styles.input}
                    disabled
                    required
                  />
                )}
                <FaPen className={styles.editIcon} onClick={() => habilitarCampo("circuito")} />
              </div>
              <label className={styles.label}>Rol en la Mesa</label>
              <div className={styles.inputRow}>
                {editFields.rol ? (
                  <div style={{ flex: 1 }}>
                    <div className="select is-fullwidth is-rounded">
                      <select
                        name="rol"
                        value={rolSelected}
                        onChange={(e) => setRolSelected(e.target.value)}
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
                  </div>
                ) : (
                  <input
                    name="rol"
                    value={miembro.rol}
                    className={styles.input}
                    disabled
                    required
                  />
                )}
                <FaPen className={styles.editIcon} onClick={() => habilitarCampo("rol")} />
              </div>
              <div className={styles.actionRow}>
                <button
                  type="button"
                  className="button is-danger is-rounded has-text-white"
                  style={{gap:"3px"}}
                  onClick={handleEliminar}
                >
                  <FaTrashAlt /> Eliminar miembro
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
      </div>
    </div>
  );
}

export default EditarMiembro;
