import React from "react";
import classes from "./AdminContent.module.css";
import { useState } from "react";
import AdminCard from "../../Components/Cards/HomeAdminCard/AdminCard";
import NuevoCiudadano from "../../Components/Modals/Ciudadano/NuevoCiudadano";
import EditarCiudadano from "../../Components/Modals/Ciudadano/EditarCiudadano";
import NuevosCiudadanos from "../../Components/Modals/Ciudadano/NuevosCiudadanos";
import NuevoCircuito from "../../Components/Modals/Circuito/NuevoCircuito";
import EditarCircuito from "../../Components/Modals/Circuito/EditarCircuito";
import NuevosCircuitos from "../../Components/Modals/Circuito/NuevosCircuitos";
import NuevoMiembro from "../../Components/Modals/MiembroMesa/NuevoMiembro";
import EditarMiembro from "../../Components/Modals/MiembroMesa/EditarMiembro";
import NuevosMiembros from "../../Components/Modals/MiembroMesa/NuevosMiembros";
import NuevoEstablecimiento from "../../Components/Modals/Establecimiento/NuevoEstablecimiento";
import EditarEstablecimiento from "../../Components/Modals/Establecimiento/EditarEstablecimiento";
import NuevosEstablecimientos from "../../Components/Modals/Establecimiento/NuevosEstablecimientos";

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
              onClick: () => setModal("nuevoCircuito"),
            },
            {
              label: "Editar Circuito",
              onClick: () => setModal("editarCircuito"),
            },
            {
              label: "Nuevos Circuitos",
              onClick: () => setModal("nuevosCircuitos"),
            },
          ]}
        />
        <AdminCard
          title="Establecimiento"
          buttons={[
            {
              label: "Nuevo Establecimiento",
              onClick: () => setModal("nuevoEstablecimiento"),
            },
            {
              label: "Editar Establecimiento",
              onClick: () => setModal("editarEstablecimiento"),
            },
            {
              label: "Nuevos Establecimientos",
              onClick: () => setModal("nuevosEstablecimientos"),
            },
          ]}
        />
        <AdminCard
          title="Miembro de Mesa"
          buttons={[
            {
              label: "Nuevo Miembro",
              onClick: () => setModal("nuevoMiembro"),
            },
            {
              label: "Editar Miembro",
              onClick: () => setModal("editarMiembro"),
            },
            {
              label: "Nuevos Miembros",
              onClick: () => setModal("nuevosMiembros"),
            },
          ]}
        />
      </div>
      {modal === "nuevoCiudadano" && <NuevoCiudadano onClose={handleClose} />}
      {modal === "editarCiudadano" && <EditarCiudadano onClose={handleClose} />}
      {modal === "nuevosCiudadanos" && <NuevosCiudadanos onClose={handleClose} />}
      {modal === "nuevoCircuito" && <NuevoCircuito onClose={handleClose} />}
      {modal === "editarCircuito" && <EditarCircuito onClose={handleClose} />}
      {modal === "nuevoCircuito" && (
        <NuevoCircuito onClose={() => setModal(null)} setModal={setModal} />
      )}      {modal === "nuevoMiembro" && <NuevoMiembro onClose={handleClose} />}
      {modal === "editarMiembro" && <EditarMiembro onClose={handleClose} />}
      {modal === "nuevosMiembros" && <NuevosMiembros onClose={handleClose} />}
      {modal === "nuevoEstablecimiento" && <NuevoEstablecimiento onClose={handleClose} />}
      {modal === "editarEstablecimiento" && <EditarEstablecimiento onClose={handleClose} />}
      {modal === "nuevosEstablecimientos" && <NuevosEstablecimientos onClose={handleClose} />}
    </div>
  );
}
export default Datos;
