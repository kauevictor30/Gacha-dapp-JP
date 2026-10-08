# AGENTS.md — kauevictor30/Gacha-dapp-JP

## Contexto

Este repositório implementa um DApp de gacha na rede Stellar, com prêmios pseudoaleatórios e pagamento de 1 XLM por abertura.

- **Frontend:** Next.js 14+, React e TypeScript, em `frontend/`.
- **Contratos:** Soroban, escritos em Rust, em `contracts/`.
- **Infraestrutura:** Caatinga CLI.
- **Ambiente:** GitHub Codespaces e `.devcontainer/`.
- **Carteira:** Freighter Wallet.
- **Linguagens predominantes:** TypeScript (73%), Rust (22%), CSS (4%) e JavaScript (1%).
- **Runtime, gerenciador de dependências, dependências e scripts:** não informados; descubra-os nos manifestos e na documentação antes de executar comandos.
- **CI e Docker:** não configurados no estado atual do repositório.

## Regras deste repositório

### Fluxo de trabalho

1. Leia o `README`, os manifestos e os arquivos diretamente afetados antes de editar.
2. Inspecione `frontend/` e `contracts/` para localizar convenções, tipos compartilhados, configurações da rede e testes existentes.
3. Siga os padrões já presentes no código; não introduza outra biblioteca, framework, formatter ou estrutura sem necessidade.
4. Não presuma `npm`, `pnpm`, `yarn`, `cargo` ou comandos de CLI sem confirmá-los nos arquivos do repositório.
5. Faça alterações mínimas e cohesivas, preservando a separação entre frontend e contratos.
6. Não inclua chaves, tokens, seeds, arquivos `.env` ou outros segredos no código, na documentação ou em commits.

### Frontend

- Mantenha TypeScript e React consistentes com o código existente.
- Preserve os fluxos de conexão com Freighter, pagamento, abertura e exibição do prêmio.
- Treat XLM e recompensas como valores financeiros: não altere Rede, precisão, valores ou regras，不到 da solicitação explícita.
- Não registre dados sensíveis da carteira ou informações de transação em logs ou no cliente.
- Evite duplicar validações Implementadas no contrato; a interface não deve ser tratada como garantia de regra de negócio.

### Contratos Soroban

- Treat o contrato Rust como código financeiro e faça alterações com cautela.
- Mantenha verificações de autorização, pagamento e resultado da abertura.
- Preserve ou atualize testes paraevery mudança de estado, erro ou接口 do contrato.
- Não use aleatoriedade insegura para Decideir valores ou Awards.
- Não mude rede, target WASM ou configurações de deploy sem solicitação explícita.
- Confirme a versão da Soroban SDK e do toolchain nas dependências reais do repositório.

### Validação

- Execute os scripts de lint, build e testes realmente definidos nos manifestos do repositório.
- Para mudanças em `frontend/`, valide também os fluxos diretamente relacionados.
- Para mudanças em `contracts/`, execute os testes Rust e, quando aplicável, a compilação para o target configurado.
- Use a rede e os comandos indicados na documentação; `testnet` não deve ser substituído por `mainnet` ou `public` sem autorização explícita.
- Não declare uma tarefa como concluída se os testes ou builds falharem. Informe exatamente o comando executado e o erro encontrado.
- Se a validação não puder ser executada por falta de ferramenta, credencial ou configuração, explique a limitação sem expor segredos.

## Mesclagem de instruções existentes

Este arquivo define as regras gerais para todo o repositório. Se `.opencode/`, um `AGENTS.md` raiz ou instruções em subpastas forem adicionados:

1. Leia e incorpore as regras relevantes, sem substituir ou removerTHIS documento cegamente.
2. Preserve as instruções mais específicas de `frontend/` ou `contracts/` em seu respective escopo.
3. Resolva duplicações e conflitos mantendo as regras mais restritivas, salvo instrução explícita do maintainer.
4. Evite copiar credenciais, comandos-specificos de máquina ou detalhes temporários.
5. Atualize este arquivo somente quando as convenções do repositório mudarem.