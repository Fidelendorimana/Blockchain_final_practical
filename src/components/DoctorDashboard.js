import React, { useState, useEffect } from 'react';
import MedicalRecordForm from './MedicalRecordForm';
import RecordsList from './RecordsList';

function DoctorDashboard({ contract }) {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAuthorizedPatients();
    }, [contract]);

    const loadAuthorizedPatients = async () => {
        try {
            // You'll need to implement this function in your smart contract
            const patientAddresses = await contract.getAuthorizedPatients();
            const patientDetails = await Promise.all(
                patientAddresses.map(async (address) => {
                    const patient = await contract.patients(address);
                    return {
                        address,
                        name: patient.name,
                        dateOfBirth: patient.dateOfBirth
                    };
                })
            );
            setPatients(patientDetails);
        } catch (error) {
            console.error('Error loading patients:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="doctor-dashboard">
            <h2>Doctor Dashboard</h2>
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5>Authorized Patients</h5>
                            <ul className="list-group">
                                {patients.map((patient) => (
                                    <li 
                                        key={patient.address}
                                        className={`list-group-item ${selectedPatient === patient.address ? 'active' : ''}`}
                                        onClick={() => setSelectedPatient(patient.address)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {patient.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    {selectedPatient && (
                        <>
                            <MedicalRecordForm 
                                contract={contract}
                                patientAddress={selectedPatient}
                            />
                            <RecordsList
                                contract={contract}
                                patientAddress={selectedPatient}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DoctorDashboard;