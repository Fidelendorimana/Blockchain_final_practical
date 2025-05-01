import React, { useState, useEffect } from 'react';
import { getFromIPFS } from '../services/ipfsService';

function RecordsList({ contract, patientAddress }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecords();
    }, [contract, patientAddress]);

    const loadRecords = async () => {
        try {
            const records = await contract.getPatientRecords(patientAddress);
            const encryptionKey = await contract.getPatientEncryptionKey(patientAddress);
            
            const processedRecords = await Promise.all(
                records.map(async (record) => {
                    const data = await getFromIPFS(record.ipfsHash, encryptionKey);
                    const metadata = JSON.parse(record.metadata);
                    return {
                        ...record,
                        ...metadata,
                        data
                    };
                })
            );
            
            setRecords(processedRecords);
        } catch (error) {
            console.error('Error loading records:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading records...</div>;

    return (
        <div className="records-list">
            <h3>Medical Records</h3>
            {records.map((record) => (
                <div key={record.id} className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Record #{record.id}</h5>
                        <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                        <p><strong>Prescription:</strong> {record.prescription}</p>
                        <p><strong>Doctor:</strong> {record.doctorName}</p>
                        <p><strong>Date:</strong> {new Date(record.timestamp * 1000).toLocaleString()}</p>
                        {record.data && (
                            <div>
                                <strong>Attachments:</strong>
                                <div className="mt-2">
                                    <a 
                                        href={URL.createObjectURL(new Blob([record.data]))}
                                        download={`record-${record.id}`}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Download File
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RecordsList;