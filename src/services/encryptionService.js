import crypto from 'crypto';
import config from '../../config/config';

export const generateEncryptionKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

export const encryptFile = async (file, key) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(
        config.encryption.algorithm,
        Buffer.from(key, 'hex'),
        iv
    );
    
    const encryptedData = Buffer.concat([
        cipher.update(file),
        cipher.final()
    ]);
    
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encryptedData]);
};

export const decryptFile = async (encryptedData, key) => {
    const iv = encryptedData.slice(0, 12);
    const tag = encryptedData.slice(12, 28);
    const data = encryptedData.slice(28);
    
    const decipher = crypto.createDecipheriv(
        config.encryption.algorithm,
        Buffer.from(key, 'hex'),
        iv
    );
    
    decipher.setAuthTag(tag);
    return Buffer.concat([
        decipher.update(data),
        decipher.final()
    ]);
};