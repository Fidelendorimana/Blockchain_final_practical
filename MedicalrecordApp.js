import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import MedicalRecord from '../artifacts/contracts/MedicalRecord.sol/MedicalRecord.json';

const contractAddress = "YOUR_CONTRACT_ADDRESS";

function MedicalRecordApp() {
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [patientData, setPatientData] = useState(null);
    
    useEffect(() => {
        initWeb3();
    }, []);

    const initWeb3 = async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, MedicalRecord.abi, signer);
        
        setProvider(provider);
        setContract(contract);
        setAccount(await signer.getAddress());
    };

    const registerPatient = async (name, dateOfBirth, bloodType) => {
        try {
            const tx = await contract.registerPatient(name, dateOfBirth, bloodType);
            await tx.wait();
            alert("Patient registered successfully!");
        } catch (error) {
            console.error("Error registering patient:", error);
        }
    };

    return (
        <div className="container">
            <h1>MedChain - Medical Records on Blockchain</h1>
            {account && (
                <p>Connected Account: {account}</p>
            )}
            {/* Add your UI components here */}
        </div>
    );
}

export default MedicalRecordApp;