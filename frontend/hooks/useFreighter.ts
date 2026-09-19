'use client';

import { useCallback, useState, useEffect } from 'react';
import { isConnected, requestAccess, getNetwork, getPublicKey, signTransaction } from '@stellar/freighter-api';
import { TransactionBuilder, SorobanRpc, Networks } from '@stellar/stellar-sdk';

interface FreighterState {
  connected: boolean;
  address: string | null;
  network: string | null;
}

export function useFreighter() {
  const [wallet, setWallet] = useState<FreighterState>({
    connected: false,
    address: null,
    network: null,
  });

  const checkConnection = useCallback(async () => {
    try {
      const result = await isConnected();
      if (result) {
        const access = await getPublicKey();
        const net = await getNetwork();
        setWallet({
          connected: true,
          address: access,
          network: net,
        });
      }
    } catch (error) {
      console.error('Failed to check wallet connection:', error);
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const connect = useCallback(async () => {
    try {
      const access = await requestAccess();
      const net = await getNetwork();
      setWallet({
        connected: true,
        address: access,
        network: net,
      });
      return access;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      connected: false,
      address: null,
      network: null,
    });
  }, []);

  const signAndSubmit = useCallback(async (
    xdr: string,
    rpcUrl: string = 'https://soroban-testnet.stellar.org',
    passphrase: string = 'Test SDF Network ; September 2015'
  ) => {
    const signedTxXdr = await signTransaction(xdr, {
      network: 'TESTNET',
    });

    const server = new SorobanRpc.Server(rpcUrl);
    const tx = TransactionBuilder.fromXDR(signedTxXdr, passphrase);
    const result = await server.sendTransaction(tx);
    return result;
  }, []);

  return { wallet, connect, disconnect, signAndSubmit, checkConnection };
}