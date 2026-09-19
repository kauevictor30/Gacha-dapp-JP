import { defineConfig } from "@caatinga/cli";

export default defineConfig({
  project: {
    name: "gacha-dapp",
    version: "1.0.0",
  },
  contracts: {
    gacha_machine: {
      path: "contracts/gacha-machine",
    },
  },
  networks: {
    testnet: {
      rpcUrl: "https://soroban-testnet.stellar.org",
      horizonUrl: "https://horizon-testnet.stellar.org",
      networkPassphrase: "Test SDF Network ; September 2015",
    },
  },
});
