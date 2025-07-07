import React from 'react';
import { useState } from "react";
import classes from './Eleccion.module.css';
import AdminCard from '../../Components/Cards/HomeAdminCard/AdminCard';
import NuevaLista from '../../Components/Modals/Lista/NuevaLista';
import EliminarLista from '../../Components/Modals/Lista/EliminarLista';
import CountdownToEvening from '../../Components/AdminStats/Countdown';

// Crear una lista y editarla (borrarla tambien)


function Eleccion() {
    const [modal, setModal] = useState(null);

    const handleClose = () => setModal(null);

    const handleCrearLista = (data) => {
        console.log("Datos de la nueva lista:", data);
        alert("Lista simulada creada correctamente.");
        setModal(null);
    };


    const [progress, setProgress] = React.useState(90);
    return (
        <div className={classes.pageContainer}>
            <p className="title h1 has-text-link ">Elección</p>
            <div className={classes.pageContent}>


                <AdminCard
                    title="Lista"
                    buttons={[
                        { label: "Nueva", onClick: () => setModal("nuevaLista") },
                        { label: "Eliminar", onClick: () => setModal("eliminarLista") },
                    ]}
                />


                <div className={`${classes.cardPanel}`}>
                    <p className={`title is-4 mt-1 has-text-link ${classes.cardTitle}`}>Progreso elección</p>
                    <div className={classes.upperPanel}>
                        <p className={classes.panelSubtitle}>Porcentaje de avance</p>
                        <progress
                            className="progress is-link mb-0"
                            value={progress}
                            max="100"
                            style={{ borderRadius: '10px' }}
                        ></progress>
                        <p className={classes.percentageText}>{progress}%</p>
                    </div>
                    <div className={`${classes.timePanel}`}>
                        <p className="title is-4 has-text-link">Tiempo restante</p>
                        <CountdownToEvening />
                    </div>
                </div>
            </div>
            {modal === "nuevaLista" && (
                <NuevaLista onClose={() => setModal(null)} onCrear={handleCrearLista} />
            )}
            {modal === "eliminarLista" && (
                <EliminarLista onClose={() => setModal(null)} />
            )}
        </div>

    );
}
export default Eleccion;
