import React from 'react';
import classes from './AdminContent.module.css'; 
import AdminCard from '../../Components/Cards/HomeAdminCard/AdminCard';

function Eleccion() {
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
            </div>
        </div>
    );
}
export default Eleccion;
