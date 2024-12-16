import React, { useEffect } from 'react';
import './Toast.css';

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast ${type}`}>
            <span>{message}</span>
            <button className="close" onClick={onClose}>×</button>
        </div>
    );
}

export default Toast;
