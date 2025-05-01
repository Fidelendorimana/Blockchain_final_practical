import React, { useState, useEffect } from 'react';
import { generateEncryptionKey } from './services/encryptionService';
import contractService from './services/contractService';
import Navigation from './components/Navigation';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import PatientRegistration from './components/PatientRegistration';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
    const [account, setAccount] = useState(null);
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            await contractService.init(process.env.REACT_APP_CONTRACT_ADDRESS);
            const account = await contractService.getCurrentAccount();
            if (account) {
                await handleAccountConnected(account);
            }
        } catch (error) {
            console.error('Initialization error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccountConnected = async (account) => {
        setAccount(account);
        const { isDoctor, isPatient } = await contractService.checkUserType(account);
        setUserType(isDoctor ? 'doctor' : isPatient ? 'patient' : null);
    };

    const connectWallet = async () => {
        try {
            const account = await contractService.connectWallet();
            await handleAccountConnected(account);
        } catch (error) {
            alert('Error connecting wallet: ' + error.message);
        }
    };

    const handleLogout = () => {
        setAccount(null);
        setUserType(null);
    };

    if (loading) return <div>Loading...</div>;

    if (!account) {
        return (
            <div className="container mt-5 text-center">
                <h1>Welcome to MedChain</h1>
                <button 
                    className="btn btn-primary btn-lg mt-4"
                    onClick={connectWallet}
                >
                    Connect Wallet
                </button>
            </div>
        );
    }

    return (
        <NotificationProvider>
            <div>
                <Navigation 
                    account={account}
                    userType={userType}
                    onLogout={handleLogout}
                />
                <div className="container">
                    {!userType && <PatientRegistration contract={contractService.contract} />}
                    {userType === 'doctor' && <DoctorDashboard contract={contractService.contract} />}
                    {userType === 'patient' && (
                        <PatientDashboard 
                            contract={contractService.contract}
                            account={account}
                        />
                    )}
                </div>
            </div>
        </NotificationProvider>
    );
}

export default App;