function ConfirmarCierreModal({ onConfirm, onCancel }) {
    return (
        <div className="modal">
            <div>
                <h2>¿Seguro que deseas cerrar el circuito?</h2>
                <button onClick={onConfirm}>
                    Sí
                </button>
                <button onClick={onCancel}>
                    Cancelar
                </button>
            </div>
        </div>
    )
}

export default ConfirmarCierreModal;
