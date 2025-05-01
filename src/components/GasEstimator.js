import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';

function GasEstimator({ tx }) {
    const { provider } = useWeb3();
    const [gasEstimate, setGasEstimate] = useState(null);
    const [gasPrice, setGasPrice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const estimateGas = async () => {
            if (!provider || !tx) return;

            try {
                setLoading(true);
                const [gasLimit, currentGasPrice] = await Promise.all([
                    provider.estimateGas(tx),
                    provider.getGasPrice()
                ]);

                const totalCost = gasLimit.mul(currentGasPrice);
                
                setGasEstimate(ethers.utils.formatEther(totalCost));
                setGasPrice(ethers.utils.formatUnits(currentGasPrice, 'gwei'));
            } catch (error) {
                console.error('Error estimating gas:', error);
            } finally {
                setLoading(false);
            }
        };

        estimateGas();
    }, [provider, tx]);

    if (loading) return <div>Estimating gas...</div>;

    return (
        <div className="gas-estimator">
            <div className="alert alert-info">
                <small>
                    Estimated Gas Price: {gasPrice} Gwei
                    <br />
                    Estimated Total Cost: {gasEstimate} ETH
                </small>
            </div>
        </div>
    );
}

export default GasEstimator;