import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

function ConnectButton() {
    const { connectWallet, disconnect, account, isLoading } = useWeb3();

    if (isLoading) return <button className="btn btn-secondary" disabled>Loading...</button>;

    if (account) {
        return (
            <button 
                className="btn btn-outline-danger" 
                onClick={disconnect}
            >
                Disconnect ({account.slice(0, 6)}...{account.slice(-4)})
            </button>
        );
    }

    return (
        <button 
            className="btn btn-primary" 
            onClick={connectWallet}
        >
            Connect Wallet
        </button>
    );
}

export default ConnectButton;