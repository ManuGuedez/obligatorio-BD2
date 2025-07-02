
import React, { useState } from "react";
import classes from "./Tables.module.css";

const Tables = ({ reportsArray }) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [circuito, setCircuito] = useState("");

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
            <div className={classes.tablesPanel}>
                <h2 className="title is-5 mb-4">Seleccioná un circuito</h2>
                <div className="select is-link is-rounded is-medium">
                    <select onChange={(e) => setCircuito(e.target.value)} defaultValue="">
                    <option value="" disabled>Elegí un circuito</option>
                    <option value="101">Circuito 101</option>
                    <option value="102">Circuito 102</option>
                    <option value="103">Circuito 103</option>
                    </select>
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
                        <option value="" disabled>Elegir circuito</option>
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
