import React from "react";
import classes from "./Datos.module.css";
import { useState } from "react";
import AdminCard from "../../Components/Cards/HomeAdminCard/AdminCard";
import NuevoCiudadano from "../../Components/Modals/Ciudadano/NuevoCiudadano";
import EditarCiudadano from "../../Components/Modals/Ciudadano/EditarCiudadano";
import NuevoCircuito from "../../Components/Modals/Circuito/NuevoCircuito";
import EditarCircuito from "../../Components/Modals/Circuito/EditarCircuito";
import NuevoMiembro from "../../Components/Modals/MiembroMesa/NuevoMiembro";
import EditarMiembro from "../../Components/Modals/MiembroMesa/EditarMiembro";
import NuevoEstablecimiento from "../../Components/Modals/Establecimiento/NuevoEstablecimiento";
import EditarEstablecimiento from "../../Components/Modals/Establecimiento/EditarEstablecimiento";
import NuevoPolicia from "../../Components/Modals/Policías/NuevoPolicia";
import EditarPolicia from "../../Components/Modals/Policías/EditarPolicia";
import NuevoCandidato from "../../Components/Modals/Candidatos/NuevoCandidato";
import EditarCandidato from "../../Components/Modals/Candidatos/EditarCandidato";
import NuevoPartido from "../../Components/Modals/Partidos Políticos/NuevoPartido";
import EditarPartido from "../../Components/Modals/Partidos Políticos/EditarPartido";

function Datos() {
  const [modal, setModal] = useState(null);

  const handleClose = () => setModal(null);
  

  return (
    <div className={classes.pageContainer}>
      <p className="title h1 has-text-link ">Gestión de Datos</p>
      <div className={classes.pageContent}>
        <AdminCard
          title="Ciudadano"
          className="ciudadano-card"

          buttons={[
            {
              label: "Nuevo",
              onClick: () => setModal("nuevoCiudadano"),
            },
            {
              label: "Editar",
              onClick: () => setModal("editarCiudadano"),
            },
          ]}
        />
        <AdminCard
          title="Circuito"
          buttons={[
            {
              label: "Nuevo",
              onClick: () => setModal("nuevoCircuito"),
            },
            {
              label: "Editar",
              onClick: () => setModal("editarCircuito"),
            },
          ]}
        />
        <AdminCard
          title="Establecimiento"
          buttons={[
            {
              label: "Nuevo",
              onClick: () => setModal("nuevoEstablecimiento"),
            },
            {
              label: "Editar",
              onClick: () => setModal("editarEstablecimiento"),
            },
          ]}
        />
        <AdminCard
          title="Miembro de Mesa"
          buttons={[
            {
              label: "Nuevo",
              onClick: () => setModal("nuevoMiembro"),
            },
            {
              label: "Editar",
              onClick: () => setModal("editarMiembro"),
            },
          ]}
        />
        <AdminCard
          title="Policías"
          buttons={[
            {
              label: "Nuevo",
              onClick: () => setModal("nuevoPolicia"),
            },
            {
              label: "Editar",
              onClick: () => setModal("editarPolicia"),
            },
          ]}
        />
        <AdminCard
          title="Candidatos"
          buttons={[
            {
              label: "Nuevo",
              onClick: () => setModal("nuevoCandidato"),
            },
          ]}
        />
        <AdminCard
          title="Partidos Políticos"
          buttons={[
            {
              label: "Nuevo",
              onClick: () => setModal("nuevoPartido"),
            },
          ]}
        />
      </div>
      {modal === "nuevoCiudadano" && <NuevoCiudadano onClose={handleClose} />}
      {modal === "editarCiudadano" && <EditarCiudadano onClose={handleClose} />}
      {modal === "nuevoCircuito" && (
        <NuevoCircuito onClose={handleClose} setModal={setModal} />
      )}
      {modal === "editarCircuito" && <EditarCircuito onClose={handleClose} />}
      {modal === "nuevoMiembro" && <NuevoMiembro onClose={handleClose} />}
      {modal === "editarMiembro" && <EditarMiembro onClose={handleClose} />}
      {modal === "nuevoEstablecimiento" && <NuevoEstablecimiento onClose={handleClose} />}
      {modal === "editarEstablecimiento" && <EditarEstablecimiento onClose={handleClose} />}
      {modal === "nuevoPolicia" && <NuevoPolicia onClose={handleClose} />}
      {modal === "editarPolicia" && <EditarPolicia onClose={handleClose} />}
      {modal === "nuevoCandidato" && <NuevoCandidato onClose={handleClose} />}
      {modal === "editarCandidato" && <EditarCandidato onClose={handleClose} />}
      {modal === "nuevoPartido" && <NuevoPartido onClose={handleClose} />}
      {modal === "editarPartido" && <EditarPartido onClose={handleClose} />}
    </div>
  );
}
export default Datos;
