import React, { useState } from 'react';

function AddMedicalRecord({ contract }) {
    const [patientAddress, setPatientAddress] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState('');
    const [doctorName, setDoctorName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tx = await contract.addMedicalRecord(
                patientAddress,
                diagnosis,
                prescription,
                doctorName
            );
            await tx.wait();
            alert('Medical record added successfully!');
        } catch (error) {
            alert('Failed to add medical record: ' + error.message);
        }
    };

    return (
        <div className="card p-4 mb-4">
            <h3>Add Medical Record</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Patient Address"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
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
                <input
                    type="text"
                    placeholder="Doctor Name"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="form-control mb-2"
                />
                <button type="submit" className="btn btn-primary">
                    Add Record
                </button>
            </form>
        </div>
    );
}

export default AddMedicalRecord;