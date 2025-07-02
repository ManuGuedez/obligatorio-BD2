import React from 'react';
import classes from './Eleccion.module.css'; 
import AdminCard from '../../Components/Cards/HomeAdminCard/AdminCard';
import CountdownToEvening from '../../Components/AdminStats/Countdown';

function Eleccion() {
    const [progress, setProgress] = React.useState(90);
    return (
        <div className={classes.pageContainer}>
            <p className="title h1 has-text-link ">Elección</p>
            <div className={classes.pageContent}>
                <AdminCard
                    title="una card :)"
                    buttons={[
                        { label: "nuevo ciudadano", onClick: () => setModal("nuevoCiudadano") },
                        { label: "editar ciudadano", onClick: () => setModal("editarCiudadano") },
                        { label: "nuevos ciudadanos", onClick: () => setModal("listaCiudadanos") },
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
        </div>
    );
}
export default Eleccion;
