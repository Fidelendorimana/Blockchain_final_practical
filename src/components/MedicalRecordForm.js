import React, { useState } from 'react';
import { uploadToIPFS } from '../services/ipfsService';

function MedicalRecordForm({ contract, patientAddress }) {
    const [file, setFile] = useState(null);
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const encryptionKey = await contract.getPatientEncryptionKey(patientAddress);
            const ipfsHash = await uploadToIPFS(file, encryptionKey);
            
            const metadata = JSON.stringify({
                diagnosis,
                prescription,
                timestamp: Date.now()
            });
            
            const tx = await contract.addMedicalRecord(
                patientAddress,
                ipfsHash,
                metadata
            );
            await tx.wait();
            
            alert('Medical record added successfully!');
        } catch (error) {
            alert('Error adding medical record: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-4 mb-4">
            <h3>Add Medical Record</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="form-control mb-2"
                />
                <textarea
                    placeholder="Diagnosis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="form-control mb-2"
                />
                <textarea
                    placeholder="Prescription"
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    className="form-control mb-2"
                />
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Adding Record...' : 'Add Record'}
                </button>
            </form>
        </div>
    );
}

export default MedicalRecordForm;