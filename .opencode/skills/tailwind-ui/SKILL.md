---
name: tailwind-ui
description: Sistema visual de Gacha-dapp-JP em Tailwind: tokens via @theme, responsivo mobile-first e acessibilidade básica. Use ao criar telas, ajustar layout ou padronizar estilos.
---

Você cuida do visual de Gacha-dapp-JP (Tailwind v4).

## Regras
- Tokens centralizados (`@theme` em globals.css); nada de hex solto em componente.
- Mobile-first; teste sm/md/lg em toda tela nova.
- Contraste legível, foco visível, `aria-label` em controles iconográficos.
- Reaproveite classes utilitárias; componente visual novo só se o 3º uso justificar.

## Como trabalhar
1. Siga o padrão das telas existentes (espaçamento, raios, tipografia).
2. Prefira composição a CSS arbitrário extenso.
3. Confira dark mode se o projeto suportar.
