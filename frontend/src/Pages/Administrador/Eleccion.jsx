import React from 'react';
import './AdminContent.css'; // Asegúrate de tener un archivo CSS para estilos específicos
import AdminCard from '../../Components/Cards/HomeAdminCard/AdminCard';

function Eleccion() {
    return (
        <div className="page-container">
            <p className="title h1 has-text-link ">Elección</p>
            <div className="page-content">
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
