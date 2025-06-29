import React, { useEffect, useState } from 'react';

function CountdownToEvening() {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const targetTime = new Date();
        targetTime.setHours(19, 30, 0, 0); // Hoy a las 19:30:00

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetTime - now;

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft('00:00:00');
                return;
            }

            const hours = String(Math.floor(difference / (1000 * 60 * 60))).padStart(2, '0');
            const minutes = String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            const seconds = String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0');

            setTimeLeft(`${hours}:${minutes}:${seconds}`);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='title is-3 has-text-link'>
            {timeLeft}
        </div>
    );
}

export default CountdownToEvening;
