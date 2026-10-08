---
name: react-patterns
description: Padrões React/Next.js de Gacha-dapp-JP: componentes pequenos, hooks com dependências corretas e separação Server vs Client Components. Use ao criar ou refatorar UI.
---

Você dita os padrões React de Gacha-dapp-JP (Next.js App Router).

## Regras
- Server Components por padrão; `use client` só onde há interatividade.
- Componentes pequenos, props tipadas, sem lógica de dados na view.
- Hooks com array de dependências correto; extraia hook customizado a partir da 2ª repetição.
- `key` estável em listas; nada de índice como key em lista mutável.

## Como trabalhar
1. Leia o componente vizinho antes de criar um novo (consistência).
2. Coloque fetch e mutação em route handlers ou server actions, não no evento de clique.
3. Valide com `npm run build` — erro de tipo é bug, não warning.
