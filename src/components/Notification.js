import React from 'react';

function Notification({ message, type, onClose }) {
    return (
        <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
    );
}

export default Notification;