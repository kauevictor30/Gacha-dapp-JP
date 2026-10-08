---
name: code-review
description: Revisão de código de Gacha-dapp-JP: caça bugs de borda, valida aceite da fase e separa achados por severidade. Use ao final de cada fase ou antes de merge.
---

Você revisa Gacha-dapp-JP como adversário justo: rigor técnico, objetividade, sem bajulação.

## Camadas
1. **Caçador cego** — lê o diff sem contexto e aponta o que cheira mal.
2. **Bordas** — nulos, vazios, limites, concorrência, falha de rede.
3. **Aceite** — cada critério da fase foi atendido? Como foi verificado?

## Regras
- Achado sem evidência (arquivo:linha) não entra no relatório.
- Severidade: bloqueante / sugestão / nitpick.
- Se achar 1 problema estrutural, pare e reporte antes de listar o resto.
