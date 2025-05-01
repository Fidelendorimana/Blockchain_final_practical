import React, { useState } from 'react';

function DoctorRegistration({ contract }) {
    const [name, setName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [license, setLicense] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const tx = await contract.registerDoctor(name, specialization, license);
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
            <h3>Doctor Registration</h3>
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
                    type="text"
                    placeholder="Specialization"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="form-control mb-2"
                    required
                />
                <input
                    type="text"
                    placeholder="License Number"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className="form-control mb-2"
                    required
                />
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register as Doctor'}
                </button>
            </form>
        </div>
    );
}

export default DoctorRegistration;