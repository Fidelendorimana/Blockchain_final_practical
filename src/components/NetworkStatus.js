import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

function NetworkStatus() {
    const { chainId } = useWeb3();

    const getNetworkName = (chainId) => {
        switch (chainId) {
            case 1:
                return 'Ethereum Mainnet';
            case 5:
                return 'Goerli Testnet';
            case 11155111:
                return 'Sepolia Testnet';
            case 1337:
                return 'Local Network';
            default:
                return 'Unknown Network';
        }
    };

    return (
        <div className="network-status">
            <span className={`badge ${chainId ? 'bg-success' : 'bg-danger'}`}>
                {chainId ? getNetworkName(chainId) : 'Not Connected'}
            </span>
        </div>
    );
}

export default NetworkStatus;