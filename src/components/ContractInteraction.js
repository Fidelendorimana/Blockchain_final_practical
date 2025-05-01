import React, { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { useWeb3 } from '../contexts/Web3Context';
import TransactionStatus from './TransactionStatus';
import WalletBalance from './WalletBalance';
import GasEstimator from './GasEstimator';

function ContractInteraction({ contractAddress }) {
    const { contract } = useContract(contractAddress);
    const { account } = useWeb3();
    const [transactionHash, setTransactionHash] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pendingTx, setPendingTx] = useState(null);

    const handleContractCall = async (method, ...args) => {
        if (!contract || !account) return;
        
        setLoading(true);
        try {
            // Prepare transaction for gas estimation
            const tx = await contract.populateTransaction[method](...args);
            setPendingTx(tx);

            // Execute transaction
            const transaction = await contract[method](...args);
            setTransactionHash(transaction.hash);
            await transaction.wait();
            return transaction;
        } catch (error) {
            console.error(`Contract call failed (${method}):`, error);
            throw error;
        } finally {
            setLoading(false);
            setPendingTx(null);
        }
    };

    const handleTransactionConfirmed = () => {
        setTransactionHash(null);
    };

    return (
        <div className="contract-interaction">
            <WalletBalance />
            
            {pendingTx && <GasEstimator tx={pendingTx} />}
            
            {loading && (
                <div className="alert alert-info">
                    <div className="spinner-border spinner-border-sm me-2" />
                    Processing Transaction...
                </div>
            )}
            
            {transactionHash && (
                <TransactionStatus 
                    hash={transactionHash}
                    onConfirm={handleTransactionConfirmed}
                />
            )}
        </div>
    );
}

export default ContractInteraction;