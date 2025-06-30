import React from "react";
import classes from "./Datos.module.css";
import { useState } from "react";
import AdminCard from "../../Components/Cards/HomeAdminCard/AdminCard";
import NuevoCiudadano from "../../Components/Modals/Ciudadano/NuevoCiudadano";
import EditarCiudadano from "../../Components/Modals/Ciudadano/EditarCiudadano";
import NuevosCiudadanos from "../../Components/Modals/Ciudadano/NuevosCiudadanos";
import NuevoPolicia from "../../Components/Modals/Policías/NuevoPolicia";
import EditarPolicia from "../../Components/Modals/Policías/EditarPolicia";
import NuevosPolicias from "../../Components/Modals/Policías/NuevosPolicias";
import NuevoCandidato from "../../Components/Modals/Candidatos/NuevoCandidato";
import EditarCandidato from "../../Components/Modals/Candidatos/EditarCandidato";
import NuevosCandidatos from "../../Components/Modals/Candidatos/NuevosCandidatos";
import NuevoPartido from "../../Components/Modals/Partidos Políticos/NuevoPartido";
import EditarPartido from "../../Components/Modals/Partidos Políticos/EditarPartido";
import NuevosPartidos from "../../Components/Modals/Partidos Políticos/NuevosPartidos";

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
        <AdminCard
          title="Policías"
          buttons={[
            {
              label: "Nuevo Policía",
              onClick: () => setModal("nuevoPolicia"),
            },
            {
              label: "Editar Policía",
              onClick: () => setModal("editarPolicia"),
            },
            {
              label: "Nuevos Policías",
              onClick: () => setModal("nuevosPolicias"),
            },
          ]}
        />
        <AdminCard
          title="Candidatos"
          buttons={[
            {
              label: "Nuevo Candidato",
              onClick: () => setModal("nuevoCandidato"),
            },
            {
              label: "Editar Candidato",
              onClick: () => setModal("editarCandidato"),
            },
            {
              label: "Nuevos Candidatos",
              onClick: () => setModal("nuevosCandidatos"),
            },
          ]}
        />
        <AdminCard
          title="Partidos Políticos"
          buttons={[
            {
              label: "Nuevo Partido Político",
              onClick: () => setModal("nuevoPartido"),
            },
            {
              label: "Editar Partido Político",
              onClick: () => setModal("editarPartido"),
            },
            {
              label: "Nuevos Partidos Políticos",
              onClick: () => setModal("nuevosPartidos"),
            },
          ]}
        />
      </div>
      {modal === "nuevoCiudadano" && <NuevoCiudadano onClose={handleClose} />}
      {modal === "editarCiudadano" && <EditarCiudadano onClose={handleClose} />}
      {modal === "nuevosCiudadanos" && <NuevosCiudadanos onClose={handleClose} />}
      {modal === "nuevoPolicia" && <NuevoPolicia onClose={handleClose} />}
      {modal === "editarPolicia" && <EditarPolicia onClose={handleClose} />}
      {modal === "nuevosPolicias" && <NuevosPolicias onClose={handleClose} />}
      {modal === "nuevoCandidato" && <NuevoCandidato onClose={handleClose} />}
      {modal === "editarCandidato" && <EditarCandidato onClose={handleClose} />}
      {modal === "nuevosCandidatos" && <NuevosCandidatos onClose={handleClose} />}
      {modal === "nuevoPartido" && <NuevoPartido onClose={handleClose} />}
      {modal === "editarPartido" && <EditarPartido onClose={handleClose} />}
      {modal === "nuevosPartidos" && <NuevosPartidos onClose={handleClose} />}
    </div>
  );
}
export default Datos;
