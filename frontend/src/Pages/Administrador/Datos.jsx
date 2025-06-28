import React from "react";
import classes from "./AdminContent.module.css";
import { useState } from "react";
import AdminCard from "../../Components/Cards/HomeAdminCard/AdminCard";
import NuevoCiudadano from "../../Components/Modals/Ciudadano/NuevoCiudadano";
import EditarCiudadano from "../../Components/Modals/Ciudadano/EditarCiudadano";
import NuevosCiudadanos
 from "../../Components/Modals/Ciudadano/NuevosCiudadanos";
function Datos() {
  const [modal, setModal] = useState(null);

  const handleClose = () => setModal(null);

  return (
    <div className={classes.pageContainer}>
      <p className="title h1 has-text-link ">Gestión de Datos</p>
      <div className={classes.pageContent}>
        <AdminCard
          title="Ciudadano"
          buttons={[
            {
              label: "Nuevo Ciudadano",
              onClick: () => setModal("nuevoCiudadano"),
            },
            {
              label: "Editar Ciudadano",
              onClick: () => setModal("editarCiudadano"),
            },
            {
              label: "Nuevos Ciudadanos",
              onClick: () => setModal("nuevosCiudadanos"),
            },
          ]}
        />
        <AdminCard
          title="Circuito"
          buttons={[
            {
              label: "Nuevo Circuito",
              onClick: () => setModal("nuevoCiudadano"),
            },
            {
              label: "Editar Circuito",
              onClick: () => setModal("editarCiudadano"),
            },
            {
              label: "Nuevos Circuitos",
              onClick: () => setModal("listaCiudadanos"),
            },
          ]}
        />
        <AdminCard
          title="Establecimiento"
          buttons={[
            {
              label: "Nuevo Establecimiento",
              onClick: () => setModal("nuevoCiudadano"),
            },
            {
              label: "Editar Establecimiento",
              onClick: () => setModal("editarCiudadano"),
            },
            {
              label: "Nuevos Establecimientos",
              onClick: () => setModal("listaCiudadanos"),
            },
          ]}
        />
        <AdminCard
          title="Miembro de Mesa"
          buttons={[
            {
              label: "Nuevo Miembro",
              onClick: () => setModal("nuevoCiudadano"),
            },
            {
              label: "Editar Miembro",
              onClick: () => setModal("editarCiudadano"),
            },
            {
              label: "Nuevos Miembros",
              onClick: () => setModal("listaCiudadanos"),
            },
          ]}
        />
      </div>
      {modal === "nuevoCiudadano" && <NuevoCiudadano onClose={handleClose} />}
      {modal === "editarCiudadano" && <EditarCiudadano onClose={handleClose} />}
      {modal === "nuevosCiudadanos" && <NuevosCiudadanos onClose={handleClose} />}
    </div>
  );
}
export default Datos;
