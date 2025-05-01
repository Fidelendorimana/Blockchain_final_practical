import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

function TransactionStatus({ hash, onConfirm }) {
    const { provider } = useWeb3();
    const [status, setStatus] = React.useState('pending');
    const [confirmations, setConfirmations] = React.useState(0);

    React.useEffect(() => {
        if (!hash || !provider) return;

        const checkTransaction = async () => {
            try {
                const tx = await provider.getTransaction(hash);
                if (tx) {
                    const receipt = await tx.wait();
                    setConfirmations(receipt.confirmations);
                    if (receipt.confirmations >= 1) {
                        setStatus('confirmed');
                        onConfirm && onConfirm(receipt);
                    }
                }
            } catch (error) {
                setStatus('failed');
                console.error('Transaction failed:', error);
            }
        };

        checkTransaction();
        const interval = setInterval(checkTransaction, 5000);
        return () => clearInterval(interval);
    }, [hash, provider, onConfirm]);

    return (
        <div className="transaction-status">
            {status === 'pending' && (
                <div className="alert alert-info">
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    Transaction Pending...
                </div>
            )}
            {status === 'confirmed' && (
                <div className="alert alert-success">
                    Transaction Confirmed! ({confirmations} confirmations)
                </div>
            )}
            {status === 'failed' && (
                <div className="alert alert-danger">
                    Transaction Failed
                </div>
            )}
        </div>
    );
}

export default TransactionStatus;