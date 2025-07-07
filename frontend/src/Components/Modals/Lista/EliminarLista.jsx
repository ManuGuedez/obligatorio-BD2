import React, { useState } from "react";
import styles from "./EliminarLista.module.css";
import ApiService from "../../../services/apiServices";

function EliminarLista({ onClose }) {
    const token = localStorage.getItem("token");

    const [filtro, setFiltro] = useState("");
    const [resultado, setResultado] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [confirmando, setConfirmando] = useState(false);

    const handleBuscar = async () => {
        setMensaje("");
        setResultado(null);
        setConfirmando(false);
        try {
            const response = await ApiService.get("lista", token);
            if (response.code === 200) {
                const listas = response.data;
                const encontrada = listas.find(
                    (l) =>
                        l.nro.toString() === filtro.trim() ||
                        l.partido.toLowerCase().includes(filtro.toLowerCase())
                );
                if (encontrada) {
                    setResultado(encontrada);
                } else {
                    setMensaje("No se encontró ninguna lista con ese criterio.");
                }
            }
        } catch (error) {
            console.error("Error buscando listas:", error);
            setMensaje("Error al buscar.");
        }
    };

    const handleDelete = async () => {
        try {
            const response = await ApiService.delete(`lista/${resultado.nro}`, token);
            if (response.code === 200) {
                setMensaje(`Lista ${resultado.nro} eliminada con éxito.`);
                setResultado(null);
                setFiltro("");
                setConfirmando(false);
            } else {
                setMensaje("Error al eliminar la lista.");
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
            setMensaje("Error inesperado.");
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className={styles.modal} onClick={handleBackdropClick}>
            <div className={styles.modalBox}>
                <h2 className={styles.titulo}>Eliminar Lista</h2>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Buscar por número o partido"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />


                {mensaje && (
                    <div
                        className={
                            mensaje.toLowerCase().includes("éxito")
                                ? styles.mensajeExito
                                : styles.mensajeError
                        }
                    >
                        {mensaje}
                    </div>
                )}

                {resultado && !confirmando && (
                    <div className={styles.card}>
                        <div>
                            <strong>#{resultado.nro}</strong> - {resultado.descripcion} <br />
                            Partido: {resultado.partido} <br />
                            Candidato: {resultado.nombre_candidato} {resultado.apellido_candidato} <br />
                            Departamento: {resultado.departamento}
                        </div>
                        <button
                            className={styles.botonEliminar}
                            onClick={() => setConfirmando(true)}
                        >
                            Eliminar
                        </button>
                    </div>
                )}

                {confirmando && (
                    <div className={styles.confirmBox}>
                        <p>¿Estás seguro que deseas eliminar la lista <strong>#{resultado.nro}</strong>?</p>
                        <div className={styles.confirmActions}>
                            <button className={styles.botonEliminar} onClick={handleDelete}>
                                Sí, eliminar
                            </button>
                            <button className={styles.botonCancelar} onClick={() => setConfirmando(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                <div className={styles.headerActions}>
                    <button className={styles.botonBuscar} onClick={handleBuscar}>
                        Buscar
                    </button>
                    <button className={styles.botonCerrar} onClick={onClose}>
                        Cerrar
                    </button>
                </div>


            </div>
        </div>
    );
}

export default EliminarLista;
