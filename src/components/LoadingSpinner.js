import React from 'react';

function LoadingSpinner({ message = 'Loading...' }) {
    return (
        <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className="ms-3">{message}</div>
        </div>
    );
}

export default LoadingSpinner;