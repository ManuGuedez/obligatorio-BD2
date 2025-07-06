import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "./Confirmacion.module.css";
import { useFlujo } from "../Context/FlujoContext";

export default function Confirmacion() {
    const navigate = useNavigate();
    const { reset, limpiarRespuestas } = useFlujo();

    useEffect(() => {
        const bloquearNavegacion = () => {
            navigate("/", { replace: true });
        };

        window.addEventListener("popstate", bloquearNavegacion);

        const timeout = setTimeout(() => {
            navigate("/inicio", { replace: true });
        }, 5000);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener("popstate", bloquearNavegacion);
        };
    }, [navigate, reset]);

    useEffect(() => {
        reset();
        limpiarRespuestas();
    }, []);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.confirmBox}>
                <p className={styles.confirmText}>Su voto fue emitido con éxito</p>
                <FontAwesomeIcon icon={faCircleCheck} size="6x" className={styles.checkIcon} />
            </div>
        </div>
    );
}
