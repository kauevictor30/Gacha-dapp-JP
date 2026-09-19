# Gacha DApp — Máquina de Gacha na Rede Stellar

Aplicação descentralizada que simula a mecânica de um lootbox. O usuário paga 1 XLM por abertura e recebe um prêmio pseudo-aleatório.

## Stack Tecnológica

- **Frontend:** Next.js 14+ (React, TypeScript)
- **Contrato Inteligente:** Soroban (Rust)
- **Infraestrutura:** Caatinga CLI
- **Ambiente:** GitHub Codespaces (Devcontainers)
- **Carteira:** Freighter Wallet

## Início Rápido

### Opção 1: GitHub Codespaces (Recomendado)

1. Faça fork do repositório
2. Clique em "Code" → "Codespaces" → "Create codespace on main"
3. Aguarde o container ser criado (~3 minutos)
4. Execute no terminal:

```bash
caatinga doctor --network testnet
```

### Opção 2: Desenvolvimento Local

1. Instale as dependências:
   - [Rust](https://rustup.rs/) (com target `wasm32v1-none`)
   - [Node.js](https://nodejs.org/) (LTS)
   - [Stellar CLI](https://github.com/stellar/stellar-cli)
   - [Caatinga CLI](https://github.com/caatinga/cli): `npm install -g @caatinga/cli`

2. Verifique o ambiente:
```bash
caatinga doctor --network testnet
```

## Comandos Principais

| Comando | Descrição |
|---|---|
| `caatinga doctor` | Verifica dependências e conexão com a rede |
| `caatinga build` | Compila o contrato para WASM |
| `caatinga deploy` | Implantna o contrato na rede |
| `caatinga generate` | Gera bindings TypeScript para o frontend |
| `caatinga invoke` | Invoca uma função do contrato |

## Estrutura do Projeto

```
gacha-dapp/
├── contracts/gacha-machine/   # Contrato Soroban (Rust)
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs             # Funções principais
│       ├── storage.rs         # Tipos de storage
│       ├── errors.rs          # Erros customizados
│       └── test.rs            # Testes unitários
├── frontend/                  # Aplicação Next.js
│   ├── app/                   # Rotas (App Router)
│   ├── components/            # Componentes React
│   ├── hooks/                 # Hooks customizados
│   └── lib/                   # Configurações e helpers
├── .devcontainer/             # Configuração do Codespaces
└── caatinga.config.ts         # Configuração do Caatinga
```

## Fluxo da Aplicação

1. Usuário conecta carteira Freighter
2. Clica em "Abrir Baú"
3. Assina transação que transfere 1 XLM para o contrato
4. Contrato processa pagamento e gera resultado pseudo-aleatório
5. Resultado é exibido com animação

## Probabilidades

| Prêmio | Probabilidade |
|---|---|
| Bucket | 1% |
| Botton | 2% |
| Chaveiro | 7% |
| Nada | 90% |

## Deploy na Testnet

1. Configure sua identidade Stellar:
```bash
stellar keys add alice --secret <YOUR_SECRET_KEY>
```

2. Implantna o contrato:
```bash
caatinga deploy --source alice --network testnet
```

3. Gere os bindings:
```bash
caatinga generate
```

4. Copie o Contract ID para `frontend/.env.local`

## Licença

MIT
