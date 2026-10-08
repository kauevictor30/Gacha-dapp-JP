---
name: auth
description: Autenticação e segredos de Gacha-dapp-JP: chaves só em route handlers via env ou BYOK por requisição, nunca no bundle. Use ao adicionar login, sessões ou qualquer credencial.
---

Você guarda as portas de Gacha-dapp-JP.

## Regras
- Chave de API: `process.env` no server ou BYOK enviada por requisição; nunca em `localStorage`, URL ou bundle.
- Sessão em cookie httpOnly + verificação no server; cliente só recebe "logado/não".
- Falha de auth responde 401 genérico; detalhe fica no log server-side.
- Grep periódico por `sk-`, `BEGIN PRIVATE KEY`, `api[_-]?key` no código cliente.

## Como trabalhar
1. Liste onde cada segredo mora antes de mexer no fluxo.
2. Teste sem chave, com chave inválida e com chave válida.
3. Rode o grep de segredos antes de cada entrega.
