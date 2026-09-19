export const STELLAR_CONFIG = {
  testnet: {
    rpcUrl: 'https://soroban-testnet.stellar.org',
    horizonUrl: 'https://horizon-testnet.stellar.org',
    networkPassphrase: 'Test SDF Network ; September 2015',
    nativeTokenContractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
  },
  mainnet: {
    rpcUrl: 'https://soroban.stellar.org',
    horizonUrl: 'https://horizon.stellar.org',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    nativeTokenContractId: 'CAS3J7GYGXMT6FLJ5V4HD6RZ5HC2JM6B6KZVBH4X3JDW5M5V5V5V5V5',
  },
} as const;

export type Network = keyof typeof STELLAR_CONFIG;

export function getConfig(network: Network = 'testnet') {
  return STELLAR_CONFIG[network];
}

export const GACHA_COST = 10_000_000; // 1 XLM in stroops

export const PRIZE_PROBABILITIES = [
  { id: 0, name: 'Bucket', min: 0, max: 0, weight: 1 },
  { id: 1, name: 'Botton', min: 1, max: 2, weight: 2 },
  { id: 2, name: 'Chaveiro', min: 3, max: 9, weight: 7 },
  { id: 3, name: 'Nada', min: 10, max: 99, weight: 90 },
] as const;