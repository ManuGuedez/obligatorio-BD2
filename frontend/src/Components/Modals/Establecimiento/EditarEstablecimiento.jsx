// EditarEstablecimiento.jsx
import React, { useState, useRef, useEffect } from "react";
import styles from "./EditarEstablecimiento.module.css";
import { FaSearch } from "react-icons/fa";
import adminService from "../../../services/adminServices";

function EditarEstablecimiento({ onClose }) {
    const overlayRef = useRef();
    const [establecimientoEncontrado, setEstablecimientoEncontrado] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [idEstablecimiento, setIdEstablecimiento] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [busquedaZona, setBusquedaZona] = useState("");

    const [formData, setFormData] = useState({
        nombre: "",
        zona: "",
        tipo: "escuela",
        direccion: ""
    });

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };


    useEffect(() => {
        const fetchZonas = async () => {
            try {
            const token = localStorage.getItem("token");
            const data = await adminService.getZonas(token);
            setZonas(data);
            } catch (error) {
            console.error("Error al obtener zonas:", error);
            }
        };

        fetchZonas();
    }, []);


    const handleSearch = async () => {
    try {
        const token = localStorage.getItem("token");
        const encodedNombre = encodeURIComponent(busqueda.trim());
        const data = await adminService.getEstablecimientoByNombre(token, encodedNombre);
        console.log("Establecimiento encontrado:", data);

        // Buscar zona por nombre en el array de zonas
        const zonaEncontrada = zonas.find(
        (z) => z.nombre.toLowerCase() === data.nombre_zona.toLowerCase()
        );

        if (!zonaEncontrada) {
        alert("No se encontró la zona asociada.");
        return;
        }

        setFormData({
        nombre: data.nombre_est,
        zona: data.nombre_zona,
        tipo: data.tipo_est,
        direccion: data.direccion_est,
        id_zona: zonaEncontrada.id
        });
        setIdEstablecimiento(data.id_est);
        setEstablecimientoEncontrado(true);
    } catch (error) {
        alert("No se pudo encontrar el establecimiento.");
        console.error("Error al buscar establecimiento:", error);
    }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const payload = {
            nombre: formData.nombre,
            direccion: formData.direccion,
            tipo: formData.tipo,
            id_zona: Number(formData.id_zona),
        };

        try {
            await adminService.updateEstablecimiento(token, idEstablecimiento, payload);
            alert("Establecimiento actualizado correctamente.");
            onClose();
        } catch (error) {
            console.error("Error al actualizar el establecimiento:", error);
        }
    };


    return (
        <div className={styles.modalOverlay} ref={overlayRef} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <h2 className={styles.title}>Editar Establecimiento</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {
                        !establecimientoEncontrado && (
                        <div className={styles.searchRow}>
                            <input
                            name="busqueda"
                            className={styles.searchInput}
                            placeholder="Nombre del establecimiento"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            />
                            <div className={styles.searchIcon} onClick={handleSearch}>
                                <FaSearch size={16} />
                            </div>
                        </div>
                        )
                    }

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
                                    type="text"
                                    placeholder="Buscar zona..."
                                    className={`${styles.input} mb-1`}
                                    value={busquedaZona}
                                    onChange={(e) => setBusquedaZona(e.target.value)}
                                />
                                <select
                                    name="id_zona"
                                    className={styles.input}
                                    value={formData.id_zona || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, id_zona: e.target.value }))}
                                    required
                                >
                                    <option value="">Seleccionar zona</option>
                                    {zonas
                                    .filter((z) =>
                                        z.nombre.toLowerCase().includes(busquedaZona.toLowerCase())
                                    )
                                    .map((z) => (
                                        <option key={z.id} value={z.id}>
                                        {z.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.row}>
                                <label className={styles.label}>Tipo</label>
                                <select
                                    name="tipo"
                                    className={styles.input}
                                    value={formData.tipo}
                                    onChange={handleChange}
                                >
                                    <option value="Escuela">Escuela</option>
                                    <option value="Liceo">Liceo</option>
                                    <option value="Club">Club</option>
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
