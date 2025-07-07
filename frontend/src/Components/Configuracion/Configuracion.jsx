import React from "react";
import { useAccesibilidad } from "./Accesibilidad";
import styles from "./Configuracion.module.css";
import { useNavigate } from "react-router-dom";

function Configuracion() {
  const navigate = useNavigate();

  const {
    modoOscuro,
    letraGrande,
    altoContraste,
    toggleModoOscuro,
    toggleLetraGrande,
    toggleAltoContraste,
  } = useAccesibilidad();

  return (
    <div className={styles.config}>
      <h1>Configuración de Accesibilidad</h1>
      <p>
        Estas configuraciones se aplicarán en toda la aplicación y se guardarán
        automáticamente.
      </p>

      <div className={styles.opcion}>
        <label>
          <input
            type="checkbox"
            checked={modoOscuro}
            onChange={toggleModoOscuro}
            aria-describedby="modo-oscuro-desc"
          />
          <span>Modo oscuro</span>
        </label>
        <small id="modo-oscuro-desc" className={styles.descripcion}>
          Cambia el fondo a colores oscuros para reducir la fatiga visual
        </small>
      </div>

      <div className={styles.opcion}>
        <label>
          <input
            type="checkbox"
            checked={letraGrande}
            onChange={toggleLetraGrande}
            aria-describedby="letra-grande-desc"
          />
          <span>Letra más grande</span>
        </label>
        <small id="letra-grande-desc" className={styles.descripcion}>
          Aumenta el tamaño de la fuente para mejorar la legibilidad
        </small>
      </div>

      <div className={styles.opcion}>
        <label>
          <input
            type="checkbox"
            checked={altoContraste}
            onChange={toggleAltoContraste}
            aria-describedby="alto-contraste-desc"
          />
          <span>Alto contraste</span>
        </label>
        <small id="alto-contraste-desc" className={styles.descripcion}>
          Mejora el contraste de colores para personas con daltonismo
        </small>
      </div>

      <div className={styles.preview}>
        <h3>Vista previa</h3>
        <p>
          Este es un ejemplo de cómo se verá el texto con las configuraciones
          actuales.
        </p>
        <button type="button">Botón de ejemplo</button>
      </div>

      <button onClick={() => navigate(-1)} className={styles.volver}>
        Volver
      </button>
    </div>
  );
}

export default Configuracion;
