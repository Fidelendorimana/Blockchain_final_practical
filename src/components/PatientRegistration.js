import React, { useState } from 'react';
import { generateEncryptionKey } from '../services/encryptionService';

function PatientRegistration({ contract }) {
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [bloodType, setBloodType] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const encryptionKey = generateEncryptionKey();
            const timestamp = new Date(dateOfBirth).getTime() / 1000;
            
            const tx = await contract.registerPatient(
                name,
                timestamp,
                bloodType,
                encryptionKey
            );
            await tx.wait();
            alert('Registration successful!');
        } catch (error) {
            alert('Registration failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-4 mb-4">
            <h3>Patient Registration</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control mb-2"
                    required
                />
                <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="form-control mb-2"
                    required
                />
                <input
                    type="text"
                    placeholder="Blood Type"
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="form-control mb-2"
                    required
                />
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register as Patient'}
                </button>
            </form>
        </div>
    );
}

export default PatientRegistration;