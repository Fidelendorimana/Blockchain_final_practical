import { ethers } from 'ethers';
import MedicalRecord from '../artifacts/contracts/MedicalRecord.sol/MedicalRecord.json';

class ContractService {
    constructor() {
        this.contract = null;
        this.provider = null;
        this.signer = null;
    }

    async init(contractAddress) {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask is not installed');
        }

        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
        this.contract = new ethers.Contract(
            contractAddress,
            MedicalRecord.abi,
            this.signer
        );
    }

    async getCurrentAccount() {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        return accounts[0];
    }

    async connectWallet() {
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        return accounts[0];
    }

    async checkUserType(address) {
        const isDoctor = await this.contract.doctors(address);
        const isPatient = await this.contract.patients(address);
        return {
            isDoctor: isDoctor.exists,
            isPatient: isPatient.exists
        };
    }

    async registerPatient(name, dateOfBirth, bloodType, encryptionKey) {
        const tx = await this.contract.registerPatient(
            name,
            dateOfBirth,
            bloodType,
            encryptionKey
        );
        return tx.wait();
    }

    async registerDoctor(name, specialization, license) {
        const tx = await this.contract.registerDoctor(
            name,
            specialization,
            license
        );
        return tx.wait();
    }

    async getPatientRecords(patientAddress) {
        return this.contract.getPatientRecords(patientAddress);
    }

    async addMedicalRecord(patientAddress, ipfsHash, encryptedData, metadata) {
        const tx = await this.contract.addMedicalRecord(
            patientAddress,
            ipfsHash,
            encryptedData,
            metadata
        );
        return tx.wait();
    }

    async grantAccess(doctorAddress) {
        const tx = await this.contract.grantAccess(doctorAddress);
        return tx.wait();
    }

    async revokeAccess(doctorAddress) {
        const tx = await this.contract.revokeAccess(doctorAddress);
        return tx.wait();
    }
}

export default new ContractService();