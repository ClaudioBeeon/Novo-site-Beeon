# Ajustes e observações

Histórico de pedidos e decisões durante a construção do site, pra não depender de rolar o chat.

## 2026-08-25

- Direção: base Vucko (escala fluida, tipografia única, respiro generoso) + estrutura Awsmd (seções numeradas, prova social no hero, mosaico de trabalho).
- Cores da marca: azul `#0000FB`, amarelo `#FFC400`.
- Fontes: Nohemi (display, self-hosted) + Inter (corpo/labels).
- Hero: vídeo de fundo (`Logo girando.mp4`), cantos arredondados com margem, headline "Conectando marcas a pessoas.", ícone da abelha.
- Showcase de serviços: interação só por hover (removido o scroll vinculado — travava a rolagem).
- Cases: virou carrossel de 3 colunas estilo Awsmd "Our Services" — cards quase quadrados (~363×363px), avança 1 por vez.
- Blog: virou seção escura estilo Awsmd "Lastest Cases" — fundo `--ink`, glow radial azul, busca decorativa, cards com foto+categoria+título+resumo, carrossel 1 por vez.
- Tamanhos dos cards de Cases/Blog recalibrados para bater com as medidas reais do awsmd.com (372×380px @1440, gap generoso ~82px, título modesto 20px).

### Pendências
- Menu mobile (hamburger do header ainda não abre nada).
- Vídeos reais dos 9 cases (hoje placeholder azul listrado).
- Mapeamento de case por serviço em `lib/content.ts` (`servicos[].casos`) — Tráfego Pago e SEO ainda sem case real.
- Confirmar qual plataforma roda o site atual (para planejar migração/redirects do blog).
