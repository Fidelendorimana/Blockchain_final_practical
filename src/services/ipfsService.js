import { create } from 'ipfs-http-client';
import config from '../../config/config';

const ipfs = create({
    host: config.ipfs.host,
    port: config.ipfs.port,
    protocol: config.ipfs.protocol
});

export const uploadToIPFS = async (file, encryptionKey) => {
    try {
        const encryptedData = await encryptFile(file, encryptionKey);
        const result = await ipfs.add(encryptedData);
        return result.path;
    } catch (error) {
        throw new Error(`IPFS Upload Error: ${error.message}`);
    }
};

export const getFromIPFS = async (hash, encryptionKey) => {
    try {
        const stream = ipfs.cat(hash);
        let data = [];
        for await (const chunk of stream) {
            data.push(chunk);
        }
        const encryptedData = Buffer.concat(data);
        return decryptFile(encryptedData, encryptionKey);
    } catch (error) {
        throw new Error(`IPFS Download Error: ${error.message}`);
    }
};