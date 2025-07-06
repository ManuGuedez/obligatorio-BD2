
import React, { useState } from "react";
import classes from "./Tables.module.css";

const Tables = ({ reportsArray }) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [circuito, setCircuito] = useState("");
    const circuitos = ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110"];
    const [showDropdown, setShowDropdown] = useState(false);
    const [circuitoInput, setCircuitoInput] = useState("");

    const renderContent = () => {
        if (!reportsArray || !Array.isArray(reportsArray) || reportsArray.length < 3) {
            return <div>Cargando datos...</div>;
        }

        switch (selectedTabIndex) {
            case 0: // de un circuito
                return (
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
                );
            case 1: // agrupados por partido de un circuito
                return (
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
                );
            case 2: // por candidato de un circuito
                return (
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
                );
            default:
                return null;
        }
    };

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
                            .filter((c) => c.includes(circuitoInput))
                            .map((c) => (
                                <a
                                key={c}
                                className="dropdown-item"
                                onClick={() => {
                                    setCircuito(c);
                                    setCircuitoInput(c);
                                    setShowDropdown(false);
                                }}
                                >
                                Circuito {c}
                                </a>
                            ))}
                            {circuitos.filter((c) => c.toLowerCase().includes(circuitoInput)).length === 0 && (
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
                <div className="select is-link ml-auto mt-auto is-rounded is-small">
                    <select onChange={(e) => setCircuito(e.target.value)} defaultValue={circuito}>
                        <option value="">Volver a inicio</option>
                        <option value="101">Circuito 101</option>
                        <option value="102">Circuito 102</option>
                        <option value="103">Circuito 103</option>
                    </select>
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
