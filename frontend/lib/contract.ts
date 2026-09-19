import { Contract, TransactionBuilder, SorobanRpc, xdr } from '@stellar/stellar-sdk';
import { assembleTransaction } from '@stellar/stellar-sdk/lib/soroban/transaction';
import { getConfig, GACHA_COST } from './stellar';

export interface GachaResult {
  prizeId: number;
  roll: number;
}

export async function buildOpenChestTx(
  contractId: string,
  userAddress: string,
  network: 'testnet' | 'mainnet' = 'testnet'
) {
  const config = getConfig(network);
  const server = new SorobanRpc.Server(config.rpcUrl);
  const contract = new Contract(contractId);

  const account = await server.getAccount(userAddress);

  const txBuilder = new TransactionBuilder(account, {
    fee: '1000000',
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(
      contract.call('open_chest')
    )
    .setTimeout(300)
    .build();

  const simResult = await server.simulateTransaction(txBuilder);

  if (SorobanRpc.Api.isSimulationError(simResult)) {
    throw new Error(`Simulation failed: ${simResult.error}`);
  }

  const preparedTxBuilder = assembleTransaction(txBuilder, simResult);
  const preparedTx = preparedTxBuilder.build();
  return preparedTx.toXDR();
}

export async function buildGetLastResultTx(
  contractId: string,
  userAddress: string,
  network: 'testnet' | 'mainnet' = 'testnet'
) {
  const config = getConfig(network);
  const server = new SorobanRpc.Server(config.rpcUrl);
  const contract = new Contract(contractId);

  const account = await server.getAccount(userAddress);

  const txBuilder = new TransactionBuilder(account, {
    fee: '1000000',
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(
      contract.call('get_last_result')
    )
    .setTimeout(300)
    .build();

  const simResult = await server.simulateTransaction(txBuilder);

  if (SorobanRpc.Api.isSimulationError(simResult)) {
    throw new Error(`Simulation failed: ${simResult.error}`);
  }

  const preparedTxBuilder = assembleTransaction(txBuilder, simResult);
  const preparedTx = preparedTxBuilder.build();
  return preparedTx.toXDR();
}

export function parseGachaResult(returnValue: string): GachaResult | null {
  try {
    const returnVal = xdr.ScVal.fromXDR(returnValue, 'base64');
    if (returnVal.switch().name === 'scvU32') {
      return { prizeId: returnVal.u32(), roll: 0 };
    }
    return null;
  } catch {
    return null;
  }
}