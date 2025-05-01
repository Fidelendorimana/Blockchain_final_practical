import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';

function WalletBalance() {
    const { provider, account } = useWeb3();
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            if (provider && account) {
                try {
                    const balance = await provider.getBalance(account);
                    setBalance(ethers.utils.formatEther(balance));
                } catch (error) {
                    console.error('Error fetching balance:', error);
                }
            }
            setLoading(false);
        };

        fetchBalance();
        const interval = setInterval(fetchBalance, 10000);
        return () => clearInterval(interval);
    }, [provider, account]);

    if (!account) return null;

    return (
        <div className="wallet-balance">
            {loading ? (
                <span className="spinner-border spinner-border-sm" />
            ) : (
                <span className="badge bg-light text-dark">
                    Balance: {parseFloat(balance).toFixed(4)} ETH
                </span>
            )}
        </div>
    );
}

export default WalletBalance;