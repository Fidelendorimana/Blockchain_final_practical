export const handleContractError = (error) => {
    if (error.code === 'ACTION_REJECTED') {
        return 'Transaction was rejected by user';
    }
    
    if (error.code === 'NETWORK_ERROR') {
        return 'Network error. Please check your connection';
    }
    
    if (error.data?.message) {
        return error.data.message;
    }
    
    if (error.message) {
        // Remove technical details from error message
        const cleanMessage = error.message.split('(')[0].trim();
        return cleanMessage;
    }
    
    return 'An unexpected error occurred';
};

export const handleIPFSError = (error) => {
    if (error.message.includes('timeout')) {
        return 'IPFS operation timed out. Please try again';
    }
    
    if (error.message.includes('connection')) {
        return 'Could not connect to IPFS. Please check your connection';
    }
    
    return 'Error processing file: ' + error.message;
};

export const handleEncryptionError = (error) => {
    if (error.message.includes('key')) {
        return 'Invalid encryption key';
    }
    
    return 'Error processing encryption: ' + error.message;
};