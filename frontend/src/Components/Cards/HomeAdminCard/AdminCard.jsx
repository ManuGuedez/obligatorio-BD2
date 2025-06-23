import React from "react";
import "./AdminCard.css";

function AdminCard({ title, buttons }) {
    return (
        <div className="card-panel">
            <p className="title is-4 mt-1 has-text-link card-title">{title}</p>
            {buttons.map(({ label, onClick }, index) => (
                <button key={index} className="card-button" onClick={onClick}>
                    {label}
                </button>
            ))}
        </div>
    );
}

export default AdminCard;