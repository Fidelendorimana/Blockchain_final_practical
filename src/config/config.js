const config = {
    ipfs: {
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https'
    },
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/medchain'
    },
    encryption: {
        algorithm: 'aes-256-gcm'
    }
};

export default config;