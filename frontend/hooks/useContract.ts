'use client';

import { useCallback, useState } from 'react';
import { Contract, TransactionBuilder, SorobanRpc, Networks, xdr } from '@stellar/stellar-sdk';
import { assembleTransaction } from '@stellar/stellar-sdk/lib/soroban/transaction';
import { signTransaction } from '@stellar/freighter-api';

interface ContractResult {
  success: boolean;
  result?: number;
  error?: string;
}

interface PrizeInfo {
  id: number;
  name: string;
  description: string;
  probability: string;
}

const PRIZES: PrizeInfo[] = [
  { id: 0, name: 'Bucket', description: 'Balde temático', probability: '1%' },
  { id: 1, name: 'Botton', description: 'Botão decorativo', probability: '2%' },
  { id: 2, name: 'Chaveiro', description: 'Chaveiro promocional', probability: '7%' },
  { id: 3, name: 'Nada', description: 'Sem prêmio', probability: '90%' },
];

export function useContract() {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPrizeInfo = useCallback((id: number): PrizeInfo => {
    return PRIZES[id] || PRIZES[3];
  }, []);

  const invokeContract = useCallback(async (
    contractId: string,
    userAddress: string,
    method: string,
    args: xdr.ScVal[] = []
  ): Promise<ContractResult> => {
    setLoading(true);
    setError(null);

    try {
      const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://soroban-testnet.stellar.org';
      const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015';

      const server = new SorobanRpc.Server(RPC_URL);
      const contract = new Contract(contractId);

      // Build transaction
      const account = await server.getAccount(userAddress);

      const txBuilder = new TransactionBuilder(account, {
        fee: '1000000',
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(method, ...args)
        )
        .setTimeout(300)
        .build();

      // Simulate first
      const simResult = await server.simulateTransaction(txBuilder);

      if (SorobanRpc.Api.isSimulationError(simResult)) {
        throw new Error(`Simulation failed: ${simResult.error}`);
      }

      // Build prepared transaction with footprint
      const preparedTxBuilder = assembleTransaction(txBuilder, simResult);
      const preparedTx = preparedTxBuilder.build();

      // Sign with Freighter
      const signedTxXdr = await signTransaction(
        preparedTx.toXDR(),
        { network: 'TESTNET' }
      );

      // Submit transaction
      const signedTx = TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE);
      const sendResult = await server.sendTransaction(signedTx);

      if (sendResult.status === 'ERROR') {
        throw new Error(typeof sendResult.errorResult === 'string' ? sendResult.errorResult : 'Transaction failed');
      }

      // Poll for result
      let txResult;
      while (true) {
        txResult = await server.getTransaction(sendResult.hash);
        if (txResult.status !== 'NOT_FOUND') break;
        await new Promise((r) => setTimeout(r, 2000));
      }

      if (txResult.status === 'SUCCESS' && txResult.returnValue) {
        // Parse return value
        const returnVal = txResult.returnValue;
        if (returnVal.switch().name === 'scvU32') {
          const result = returnVal.u32();
          setLastResult(result);
          return { success: true, result };
        }
        return { success: true, result: 0 };
      } else {
        throw new Error('Transaction failed on chain');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const openChest = useCallback(async (contractId: string, userAddress: string) => {
    return invokeContract(contractId, userAddress, 'open_chest', []);
  }, [invokeContract]);

  const getLastResult = useCallback(async (contractId: string, userAddress: string) => {
    const result = await invokeContract(contractId, userAddress, 'get_last_result', []);
    if (result.success && result.result !== undefined) {
      setLastResult(result.result);
    }
    return result;
  }, [invokeContract]);

  const getPlayCount = useCallback(async (contractId: string, userAddress: string) => {
    return invokeContract(contractId, userAddress, 'get_play_count', []);
  }, [invokeContract]);

  return {
    loading,
    lastResult,
    error,
    openChest,
    getLastResult,
    getPlayCount,
    getPrizeInfo,
    PRIZES,
  };
}