import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import MedicalRecord from '../artifacts/contracts/MedicalRecord.sol/MedicalRecord.json';

export function useContract(contractAddress) {
    const { provider, account } = useWeb3();
    const [contract, setContract] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (provider && contractAddress) {
            try {
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    contractAddress,
                    MedicalRecord.abi,
                    signer
                );
                setContract(contract);
                setError(null);
            } catch (err) {
                setError(err);
                console.error("Error initializing contract:", err);
            }
        }
    }, [provider, contractAddress]);

    return { contract, error };
}