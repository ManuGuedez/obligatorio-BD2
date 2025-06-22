import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeAdministrador.css";

function HomeAdministrador() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState('datos');

    const goDatos = () => {
        setSelected('datos');
        navigate("/HomeAdministrador/Datos");
    };

    const goEleccion = () => {
        setSelected('eleccion');
        navigate("/HomeAdministrador/Eleccion");
    };

    return (
    <div className="home-admin">
        <div className="header">
            <img
            src="../../../public/Escudo20Uruguay_19.png"
            alt="Logo"
            className="logo"
            draggable="false"
            />
            <div className="header-buttonContainer">
                <button
                    className={`button is-rounded is-large px-6 ${
                        selected === "datos" ? "is-info" : "is-success"
                    }`}
                    onClick={goDatos}
                >
                    Gestión de datos
                </button>
                <button
                    className={`button is-rounded is-large px-6 ${
                        selected === "eleccion" ? "is-info" : "is-success"
                    }`}
                    onClick={goEleccion}
                >
                    Elección
                </button>
            </div>
        </div>
    </div>
    );
}

export default HomeAdministrador;
