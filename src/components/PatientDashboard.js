import React, { useState, useEffect } from 'react';
import RecordsList from './RecordsList';

function PatientDashboard({ contract, account }) {
    const [doctors, setDoctors] = useState([]);
    const [authorizedDoctors, setAuthorizedDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDoctors();
    }, [contract]);

    const loadDoctors = async () => {
        try {
            const doctorList = await contract.getAllDoctors();
            const authorized = await contract.getAuthorizedDoctors(account);
            
            const doctorDetails = await Promise.all(
                doctorList.map(async (address) => {
                    const doctor = await contract.doctors(address);
                    return {
                        address,
                        name: doctor.name,
                        specialization: doctor.specialization,
                        isAuthorized: authorized.includes(address)
                    };
                })
            );
            
            setDoctors(doctorDetails);
            setAuthorizedDoctors(authorized);
        } catch (error) {
            console.error('Error loading doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDoctorAccess = async (doctorAddress) => {
        try {
            const isAuthorized = authorizedDoctors.includes(doctorAddress);
            const tx = isAuthorized
                ? await contract.revokeAccess(doctorAddress)
                : await contract.grantAccess(doctorAddress);
            await tx.wait();
            
            await loadDoctors();
            alert(`Doctor access ${isAuthorized ? 'revoked' : 'granted'} successfully!`);
        } catch (error) {
            alert('Error updating doctor access: ' + error.message);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="patient-dashboard">
            <h2>Patient Dashboard</h2>
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5>Manage Doctor Access</h5>
                            <ul className="list-group">
                                {doctors.map((doctor) => (
                                    <li key={doctor.address} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{doctor.name}</strong>
                                                <br />
                                                <small>{doctor.specialization}</small>
                                            </div>
                                            <button
                                                className={`btn btn-${doctor.isAuthorized ? 'danger' : 'success'} btn-sm`}
                                                onClick={() => toggleDoctorAccess(doctor.address)}
                                            >
                                                {doctor.isAuthorized ? 'Revoke Access' : 'Grant Access'}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <RecordsList
                        contract={contract}
                        patientAddress={account}
                    />
                </div>
            </div>
        </div>
    );
}

export default PatientDashboard;