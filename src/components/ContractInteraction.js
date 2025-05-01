import React, { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { useWeb3 } from '../contexts/Web3Context';
import TransactionStatus from './TransactionStatus';

function ContractInteraction({ contractAddress }) {
    const { contract } = useContract(contractAddress);
    const { account } = useWeb3();
    const [transactionHash, setTransactionHash] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleContractCall = async (method, ...args) => {
        if (!contract || !account) return;
        
        setLoading(true);
        try {
            const tx = await contract[method](...args);
            setTransactionHash(tx.hash);
            await tx.wait();
            return tx;
        } catch (error) {
            console.error(`Contract call failed (${method}):`, error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleTransactionConfirmed = () => {
        setTransactionHash(null);
    };

    return (
        <div>
            {loading && <div className="alert alert-info">Processing...</div>}
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