import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

const Web3Context = createContext();

export function Web3Provider({ children }) {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
        providerOptions: {}
    });

    const connectWallet = async () => {
        try {
            const instance = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(instance);
            const signer = provider.getSigner();
            const account = await signer.getAddress();
            const network = await provider.getNetwork();

            setProvider(provider);
            setAccount(account);
            setChainId(network.chainId);

            // Subscribe to accounts change
            instance.on("accountsChanged", handleAccountsChanged);
            instance.on("chainChanged", handleChainChanged);

            return provider;
        } catch (error) {
            console.error("Error connecting wallet:", error);
            throw error;
        }
    };

    const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
            setAccount(accounts[0]);
        } else {
            await disconnect();
        }
    };

    const handleChainChanged = (chainId) => {
        window.location.reload();
    };

    const disconnect = async () => {
        await web3Modal.clearCachedProvider();
        setProvider(null);
        setAccount(null);
        setChainId(null);
    };

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            connectWallet();
        }
        setIsLoading(false);
    }, []);

    return (
        <Web3Context.Provider value={{
            connectWallet,
            disconnect,
            account,
            provider,
            chainId,
            isLoading
        }}>
            {children}
        </Web3Context.Provider>
    );
}

export const useWeb3 = () => useContext(Web3Context);