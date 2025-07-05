// EditarEstablecimiento.jsx
import React, { useState, useRef } from "react";
import styles from "./EditarEstablecimiento.module.css";
import { FaSearch } from "react-icons/fa";

function EditarEstablecimiento({ onClose }) {
    const overlayRef = useRef();
    const [establecimientoEncontrado, setEstablecimientoEncontrado] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        zona: "",
        tipo: "escuela",
        direccion: ""
    });

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    const handleSearch = () => {
        // Simulación búsqueda
        setFormData({
            nombre: "Escuela Modelo",
            zona: "Centro",
            tipo: "escuela",
            direccion: "Av. Ejemplo 123"
        });
        setEstablecimientoEncontrado(true);
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Guardar cambios:", formData);
        onClose();
    };

    return (
        <div className={styles.modalOverlay} ref={overlayRef} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <h2 className={styles.title}>Editar Establecimiento</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.searchRow}>
                        <input
                            name="busqueda"
                            className={styles.searchInput}
                            placeholder="Nombre del establecimiento"
                        />
                        <div className={styles.searchIcon} onClick={handleSearch}>
                            <FaSearch size={16} />
                        </div>
                        
                    </div>

                    {establecimientoEncontrado && (
                        <>
                            <div className={styles.row}>
                                <label className={styles.label}>Nombre</label>
                                <input
                                    name="nombre"
                                    className={styles.input}
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.row}>
                                <label className={styles.label}>Zona</label>
                                <input
                                    name="zona"
                                    className={styles.input}
                                    value={formData.zona}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.row}>
                                <label className={styles.label}>Tipo</label>
                                <select
                                    name="tipo"
                                    className={styles.input}
                                    value={formData.tipo}
                                    onChange={handleChange}
                                >
                                    <option value="escuela">Escuela</option>
                                    <option value="liceo">Liceo</option>
                                    <option value="club">Club</option>
                                </select>
                            </div>
                            <div className={styles.row}>
                                <label className={styles.label}>Dirección</label>
                                <input
                                    name="direccion"
                                    className={styles.input}
                                    value={formData.direccion}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.buttonRow}>
                                <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                                <button type="submit" className={styles.saveButton}>Guardar cambios</button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}

export default EditarEstablecimiento;
