import React from "react";
import classes from "./AdminCard.module.css";

function AdminCard({ title, buttons }) {
    return (
        <div className={`${classes.cardPanel}`}>
            <p className={`title is-4 mt-1 has-text-link ${classes.cardTitle}`}>{title}</p>
            {buttons.map(({ label, onClick }, index) => (
                <button key={index} className={classes.cardButton} onClick={onClick}>
                    {label}
                </button>
            ))}
        </div>
    );
}

export default AdminCard;