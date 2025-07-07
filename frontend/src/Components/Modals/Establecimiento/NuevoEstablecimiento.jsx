// NuevoEstablecimiento.jsx
import React, { useState, useRef, useEffect } from "react";
import styles from "./NuevoEstablecimiento.module.css";
import adminService from "../../../services/adminServices";

function NuevoEstablecimiento({ onClose }) {
  const overlayRef = useRef();
  const [zonaExiste, setZonaExiste] = useState(true);
  const [ciudadExiste, setCiudadExiste] = useState(true);
  const [zonas, setZonas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [busquedaZona, setBusquedaZona] = useState("");
  const [busquedaCiudad, setBusquedaCiudad] = useState("");
  const [busquedaDepartamento, setBusquedaDepartamento] = useState("");

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

const handleZonaBlur = (e) => {
  const zona = e.target.value.trim().toLowerCase();
  const zonaExisteEnDB = zonas.some(
    (z) => z.nombre.trim().toLowerCase() === zona
  );

  setZonaExiste(zonaExisteEnDB);

  // Si la zona existe, no necesito pedir ciudad
  if (zonaExisteEnDB) {
    setCiudadExiste(true);
  }
};


  const handleCiudadBlur = (e) => {
    const ciudad = e.target.value.trim().toLowerCase();
    const ciudadExisteEnDB = ciudades.some(
      (c) => c.nombre.trim().toLowerCase() === ciudad
    );

    setCiudadExiste(ciudadExisteEnDB);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await adminService.getZonas(token);
        setZonas([...data]);
        const data2 = await adminService.getCiudades(token);
        setCiudades([...data2]);
        const data3 = await adminService.getDepartamentos(token);
        setDepartamentos([...data3]);
      } catch (error) {
        console.error("Error al traer los datos:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      let idZona;

      if (zonaExiste) {
        // Buscar zona por nombre
        const zonaEncontrada = zonas.find(
          (z) => z.nombre.toLowerCase() === data.zona.trim().toLowerCase()
        );
        if (!zonaEncontrada) {
          alert("Zona marcada como existente pero no encontrada.");
          return;
        }
        idZona = zonaEncontrada.id;
      } else {
        let idCiudad;

        if (ciudadExiste) {
          // Buscar ciudad por nombre
          const ciudadEncontrada = ciudades.find(
            (c) => c.nombre.toLowerCase() === data.ciudad.trim().toLowerCase()
          );
          if (!ciudadEncontrada) {
            alert("Ciudad marcada como existente pero no encontrada.");
            return;
          }
          idCiudad = ciudadEncontrada.id;
        } else {
          // Crear ciudad nueva
          const ciudadCreada = await adminService.crearCiudad(
            token,
            busquedaCiudad.trim(),
            Number(data.departamento)
          );

          idCiudad = ciudadCreada.id;
        }

        // Crear zona nueva
        const zonaCreada = await adminService.crearZona(token, busquedaZona.trim(), idCiudad);
        idZona = zonaCreada.id;
      }

      // Crear establecimiento
      const payload = {
        nombre: data.nombre,
        tipo: data.tipo,
        direccion: data.direccion,
        id_zona: idZona,
      };

      console.log("Payload para crear establecimiento:", payload);

      await adminService.crearEstablecimiento(token, payload);

      alert("Establecimiento creado correctamente.");
      onClose();
    } catch (error) {
      console.error("Error creando establecimiento:", error);
      alert("Hubo un error al crear el establecimiento.");
    }
  };

  return (
    <div className={styles.modalOverlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Nuevo Establecimiento</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nombre</label>
              <input name="nombre" className={styles.input} required />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Zona</label>
              <input
                type="text"
                placeholder="Buscar zona..."
                className={`${styles.input} mb-1`}
                value={busquedaZona}
                onChange={(e) => setBusquedaZona(e.target.value)}
              />
              {zonaExiste ? (
              <select
                name="zona"
                className={styles.input}
                onBlur={(e) => handleZonaBlur(e)}
                required={zonaExiste}
              >
                <option value="">Seleccionar zona</option>
                {zonas
                  .filter((z) =>
                    z.nombre.toLowerCase().includes(busquedaZona.toLowerCase())
                  )
                  .map((z) => (
                    <option key={z.id} value={z.nombre}>
                      {z.nombre}
                    </option>
                  ))}
              </select>
              ) : (
                <p className={styles.helperText}>Se creará una nueva zona: <strong>{busquedaZona}</strong></p>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Tipo</label>
              <select name="tipo" className={styles.input} required>
                <option value="univesidad">Universidad</option>
                <option value="utu">UTU</option>
                <option value="escuela">Escuela</option>
                <option value="liceo">Liceo</option>
                <option value="club">Club</option>
                <option value="otro">Otro</option>
              </select>
            </div>
              {!zonaExiste && (
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Ciudad</label>
                  <input
                    type="text"
                    placeholder="Buscar ciudad..."
                    className={`${styles.input} mb-1`}
                    value={busquedaCiudad}
                    onChange={(e) => setBusquedaCiudad(e.target.value)}
                    onBlur={handleCiudadBlur}
                  />
                  {ciudadExiste ? (
                    <select
                      name="ciudad"
                      className={styles.input}
                      required
                    >
                      <option value="">Seleccionar ciudad</option>
                      {ciudades
                        .filter((c) =>
                          c.nombre.toLowerCase().includes(busquedaCiudad.toLowerCase())
                        )
                        .map((c) => (
                          <option key={c.id} value={c.nombre}>
                            {c.nombre}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <p className={styles.helperText}>
                      Se creará una nueva ciudad: <strong>{busquedaCiudad.trim()}</strong>
                    </p>
                  )}

                </div>
              )}
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Dirección</label>
              <input name="direccion" className={styles.input} required />
            </div>
            {!zonaExiste && !ciudadExiste && (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Departamento</label>
                <input
                  type="text"
                  placeholder="Buscar departamento..."
                  className={`${styles.input} mb-1`}
                  value={busquedaDepartamento}
                  onChange={(e) => setBusquedaDepartamento(e.target.value)}
                />
                <select
                  name="departamento"
                  className={styles.input}
                  required={!zonaExiste && !ciudadExiste}
                >
                  <option value="">Seleccionar departamento</option>
                  {departamentos
                    .filter((d) =>
                      d.nombre.toLowerCase().includes(busquedaDepartamento.toLowerCase())
                    )
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nombre}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          <div className={styles.buttonRow}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
            <button type="submit" className={styles.addButton}>Agregar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoEstablecimiento;
