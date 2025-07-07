
import React, { useState, useEffect } from "react";
import classes from "./Tables.module.css";
import adminService from "../../services/adminServices";

const Tables = () => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [circuito, setCircuito] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [circuitoInput, setCircuitoInput] = useState("");
    const [reportsArray, setReportsArray] = useState([[], [], []]);

    const renderContent = () => {
        if (!reportsArray || !Array.isArray(reportsArray) || reportsArray.length < 3) {
            return <div>Cargando datos...</div>;
        }

        switch (selectedTabIndex) {
            case 0: // de un circuito
                return reportsArray[0] && reportsArray[0].length > 0 ? (
                    <table className={`table is-fullwidth is-striped`}>
                        <thead>
                            <tr className={`is-link`}>
                                <th className={`has-text-white`} style={{ fontSize: "1.3rem", paddingLeft: "2rem" }}>Lista</th>
                                <th className={`has-text-white`} style={{ fontSize: "1.3rem", paddingLeft: "2rem" }}>Partido</th>
                                <th className={`has-text-white`} style={{ fontSize: "1.3rem", paddingLeft: "2rem" }}>Cant. Votos</th>
                                <th className={`has-text-white`} style={{ fontSize: "1.3rem", textAlign: "right", paddingRight: "2rem" }}>Porcentaje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportsArray[0].map((report, index) => (
                                <tr key={index}>
                                    <td style={{ fontSize: "1rem", paddingLeft: "2rem" }}>{report.lista}</td>
                                    <td style={{ fontSize: "1rem", paddingLeft: "2rem" }}>{report.partido}</td>
                                    <td style={{ fontSize: "1rem", paddingLeft: "2rem" }}>{report.votos}</td>
                                    <td style={{ fontSize: "1rem", textAlign: "right", paddingRight: "2rem" }}>{report.porcentaje}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="has-text-grey" style={{ padding: "2rem" }}>
                        No hay resultados para listas en este circuito.
                    </p>
                );
            case 1: // agrupados por partido de un circuito
                return reportsArray[1] && reportsArray[1].length > 0 ? (
                    <table className={`table is-fullwidth is-striped`}>
                        <thead>
                            <tr className={`is-link`}>
                                <th className={`has-text-white`} style={{ fontSize: "1.3rem", paddingLeft: "2rem" }}>Partido</th>
                                <th className={`has-text-white`} style={{ fontSize: "1.3rem", paddingLeft: "2rem" }}>Cant. Votos</th>
                                <th className={`has-text-white`} style={{ fontSize: "1.3rem", textAlign: "right", paddingRight: "2rem" }}>Porcentaje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportsArray[1].map((report, index) => (
                                <tr key={index}>
                                    <td style={{ fontSize: "1rem", paddingLeft: "2rem" }}>{report.partido}</td>
                                    <td style={{ fontSize: "1rem", paddingLeft: "2rem" }}>{report.votos}</td>
                                    <td style={{ fontSize: "1rem", textAlign: "right", paddingRight: "2rem" }}>{report.porcentaje}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    ) : (
                    <p className="has-text-grey" style={{ padding: "2rem" }}>
                        No hay resultados agrupados por partido.
                    </p>
                );
            case 2: // por candidato de un circuito
                return reportsArray[2] && reportsArray[2].length > 0 ? (
                    <table className={`table is-fullwidth is-striped`}>
                        <thead>
                            <tr className={`is-link`}>
                                <th className={`has-text-white`} style={{ fontSize: "1.3rem", paddingLeft: "2rem" }}>Partido</th>
                                <th className={`has-text-white`} style={{ fontSize: "1.3rem", paddingLeft: "2rem" }}>Candidato</th>
                                <th className={`has-text-white`} style={{ fontSize: "1.3rem", paddingLeft: "2rem" }}>Cant. Votos</th>
                                <th className={`has-text-white`} style={{ fontSize: "1.3rem", textAlign: "right", paddingRight: "2rem" }}>Porcentaje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportsArray[2].map((report, index) => (
                                <tr key={index}>
                                    <td style={{ fontSize: "1rem", paddingLeft: "2rem" }}>{report.partido}</td>
                                    <td style={{ fontSize: "1rem", paddingLeft: "2rem" }}>{report.candidato}</td>
                                    <td style={{ fontSize: "1rem", paddingLeft: "2rem" }}>{report.votos}</td>
                                    <td style={{ fontSize: "1rem", textAlign: "right", paddingRight: "2rem" }}>{report.porcentaje}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                <p className="has-text-grey" style={{ padding: "2rem" }}>
                    No hay resultados agrupados por candidato.
                </p>
                );
            default:
                return null;
        }
    };

    const [circuitos, setCircuitos] = useState([]);
    
    useEffect(() => {
        const fetchCircuitos = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await adminService.getCircuitos(token);
            setCircuitos([...data]);
            console.log("Circuitos traídos:", [...data]);
        } catch (error) {
            console.error("Error al traer los circuitos:", error);
        }
        };

        fetchCircuitos();
    }, []);
    
    useEffect(() => {
        const fetchResultados = async () => {
            if (!circuito) return;

            try {
                const token = localStorage.getItem("token");
                const data = await adminService.getResultadosPorLista(token, circuito);
                console.log("Resultados por lista:", data);
                const data2 = await adminService.getResultadosPorPartido(token, circuito);
                console.log("Resultados por partido:", data2);
                const data3 = await adminService.getResultadosPorCandidato(token, circuito);
                console.log("Resultados por candidato:", data3);
                // 1° tabla: tal cual viene
                const tabla1 = data;

                // 2° tabla: agrupados por partido
                const tabla2 = data2;

                const tabla3 = data3;

                setReportsArray([tabla1, tabla2, tabla3]);

            } catch (error) {
                console.error("Error al obtener resultados por lista:", error);
            }
        };

        fetchResultados();
    }, [circuito]);
    
    if (!circuito) {
        return (
            <div className={classes.selectCircuito}>
                <h2 className="title is-5 mb-4">Seleccioná un circuito</h2>
                <div className={`dropdown ${showDropdown ? "is-active" : ""}`} style={{ width: "300px" }}>
                    <div className="dropdown-trigger" style={{ width: "100%" }}>
                        <input
                            className="input is-rounded"
                            type="text"
                            placeholder="Buscar nº de circuito"
                            value={circuitoInput}
                            onFocus={() => setShowDropdown(true)}
                            onChange={(e) => {
                            setCircuitoInput(e.target.value);
                            setShowDropdown(true);
                            }}
                        />
                    </div>
                    <div className="dropdown-menu" style={{ width: "100%" }}>
                        <div className={`dropdown-content`} style={{ maxHeight: "150px", overflowY: "auto" }}>
                            {circuitos
                            .filter((c) => c.nro.toString().includes(circuitoInput))
                            .map((c) => (
                                <a
                                key={c.nro}
                                className="dropdown-item"
                                onClick={() => {
                                    setCircuito(c.nro);
                                    setCircuitoInput(c.nro.toString());
                                    setShowDropdown(false);
                                }}
                                >
                                Circuito {c.nro}
                                </a>
                            ))}
                            {circuitos.filter((c) => c.nro.toString().toLowerCase().includes(circuitoInput)).length === 0 && (
                                <div className="dropdown-item has-text-grey">Sin resultados</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className={classes.tablesPanel}>
            <div className={classes.headerRow}>
                <h1 className={`${classes.header}`}>Resultados</h1>
                <div className="field" style={{ maxWidth: "300px", marginBottom: "1rem", marginLeft: "auto" }}>
                    <button className="button is-rounded is-link" onClick={() => window.location.reload()}>
                        Cambiar circuito
                    </button>
                </div>
            </div>
            <div className={`${classes.reportsContainer}`}>
                <div className={`tabs is-right is-small is-toggle has-text-weight-bold ${classes.customTabs}`}>
                    <ul>
                        <li
                            className={selectedTabIndex === 0 ? "is-active" : ""}>
                            <a onClick={() => setSelectedTabIndex(0)}>
                                <span>De un circuito</span>
                            </a>
                        </li>
                        <li className={selectedTabIndex === 1 ? "is-active" : ""}>
                            <a onClick={() => setSelectedTabIndex(1)}>
                                <span>Agrupados por partido</span>
                            </a>
                        </li>
                        <li className={selectedTabIndex === 2 ? "is-active" : ""}>
                            <a onClick={() => setSelectedTabIndex(2)}>
                                <span>Agrupados por candidato</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className={`${classes.tabContent}`}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Tables;
