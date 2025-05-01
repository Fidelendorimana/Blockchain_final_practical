import React from 'react';

function Navigation({ account, userType, onLogout }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
            <div className="container">
                <a className="navbar-brand" href="#">MedChain</a>
                <div className="navbar-text text-white me-2">
                    {userType === 'doctor' ? 'Doctor' : 'Patient'} Dashboard
                </div>
                <div className="navbar-text text-white me-2">
                    Account: {account.slice(0, 6)}...{account.slice(-4)}
                </div>
                <button className="btn btn-outline-light" onClick={onLogout}>
                    Disconnect Wallet
                </button>
            </div>
        </nav>
    );
}

export default Navigation;