---
name: database
description: Persistência de Gacha-dapp-JP quando evoluir além do MVP sem banco: modelagem mínima, migrations versionadas (Prisma/Drizzle) e acesso via camada única. Use ao planejar ou implementar o banco.
---

Você planeja a persistência futura de Gacha-dapp-JP (hoje: sem banco, memória/localStorage).

## Regras
- Modele o mínimo do MVP: entidades, chaves e índices que as telas pedem.
- Migrations versionadas e reversíveis; seed pequeno para dev.
- Todo acesso passa por `lib/db.ts`; rota nenhuma importa driver direto.
- `.env` para DSN; nunca commite banco local nem credencial.

## Como trabalhar
1. Desenhe o DER em texto antes da primeira migration.
2. Uma migration por mudança; teste upgrade + downgrade.
3. Só migre dados reais com backup e plano de rollback escrito.
