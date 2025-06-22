import { useState } from 'react';
import './AdminCard.css';

function AdminCard({ title, onClick, selected }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`admin-card ${selected ? 'selected' : ''}`}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <p className="title">{title}</p>
            {isHovered && <div className="hover-overlay">Click to select</div>}
        </div>
    );
}
export default AdminCard;