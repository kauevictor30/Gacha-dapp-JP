'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isConnected, requestAccess, getNetwork, getPublicKey } from '@stellar/freighter-api';

interface WalletContextType {
  connected: boolean;
  address: string | null;
  network: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  const checkConnection = async () => {
    try {
      const result = await isConnected();
      if (result) {
        const access = await getPublicKey();
        const net = await getNetwork();
        setConnected(true);
        setAddress(access);
        setNetwork(net);
      }
    } catch (error) {
      console.error('Failed to check wallet connection:', error);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const connect = async () => {
    try {
      const access = await requestAccess();
      const net = await getNetwork();
      setConnected(true);
      setAddress(access);
      setNetwork(net);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const disconnect = () => {
    setConnected(false);
    setAddress(null);
    setNetwork(null);
  };

  return (
    <WalletContext.Provider value={{ connected, address, network, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}