function PersonaModal({ persona, onClose }) {
    if (!persona) return null; // así evita renderizar cuando persona es undefined
    
    return (
        <div className="modal">
            <div>
                <h2>Información</h2>
                <p>Nombre: {persona.nombre}</p>
                <p>CI: {persona.ci}</p>
                <p>Voto: {persona.voto}</p>
                <button onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    )
}

export default PersonaModal;
