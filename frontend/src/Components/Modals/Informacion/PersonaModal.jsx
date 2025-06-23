import classes from "./PersonaModal.module.css";

function PersonaModal({ persona, onClose, onVotar }) {
  const handleBackdropClick = (e) => {
    // Si clickeaste directamente sobre el fondo
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  if (!persona) return null;

  return (
    <div className={classes.modal} onClick={handleBackdropClick}>
      <div className={classes.modalBox}>
        <h2>Información</h2>
        <p>
          <strong>Nombre:</strong> {persona.nombre}
        </p>
        <p>
          <strong>CI:</strong> {persona.ci}
        </p>
        <p>
          <strong>Voto:</strong> {persona.voto ? "Sí" : "No"}
        </p>

        {!persona.voto && (
          <button className={classes.votarButton} onClick={onVotar}>
            Votar
          </button>
        )}

        <button className={classes.cerrarButton} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default PersonaModal;
