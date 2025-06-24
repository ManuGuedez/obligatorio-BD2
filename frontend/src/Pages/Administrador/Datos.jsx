import React from "react";
import classes from "./AdminContent.module.css";
import AdminCard from "../../Components/Cards/HomeAdminCard/AdminCard";


function Datos() {
    return (
        <div className={classes.pageContainer}>
            <p className="title h1 has-text-link ">Gestión de Datos</p>
            <div className={classes.pageContent}>
                <AdminCard
                    title="Ciudadano"
                    buttons={[
                        { label: "nuevo ciudadano", onClick: () => setModal("nuevoCiudadano") },
                        { label: "editar ciudadano", onClick: () => setModal("editarCiudadano") },
                        { label: "nuevos ciudadanos", onClick: () => setModal("listaCiudadanos") },
                    ]}
                />
                <AdminCard
                    title="Ciudadano"
                    buttons={[
                        { label: "nuevo ciudadano", onClick: () => setModal("nuevoCiudadano") },
                        { label: "editar ciudadano", onClick: () => setModal("editarCiudadano") },
                        { label: "nuevos ciudadanos", onClick: () => setModal("listaCiudadanos") },
                    ]}
                />
                <AdminCard
                    title="Ciudadano"
                    buttons={[
                        { label: "nuevo ciudadano", onClick: () => setModal("nuevoCiudadano") },
                        { label: "editar ciudadano", onClick: () => setModal("editarCiudadano") },
                        { label: "nuevos ciudadanos", onClick: () => setModal("listaCiudadanos") },
                    ]}
                />
                <AdminCard
                    title="Ciudadano"
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
export default Datos;
