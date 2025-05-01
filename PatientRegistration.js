import React, { useState } from 'react';

function PatientRegistration({ contract }) {
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [bloodType, setBloodType] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const timestamp = new Date(dateOfBirth).getTime() / 1000;
            const tx = await contract.registerPatient(name, timestamp, bloodType);
            await tx.wait();
            alert('Registration successful!');
        } catch (error) {
            alert('Registration failed: ' + error.message);
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
                />
                <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="form-control mb-2"
                />
                <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="form-control mb-2"
                >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                </select>
                <button type="submit" className="btn btn-primary">
                    Register
                </button>
            </form>
        </div>
    );
}

export default PatientRegistration;