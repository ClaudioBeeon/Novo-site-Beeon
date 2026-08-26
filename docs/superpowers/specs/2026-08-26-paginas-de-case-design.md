# Páginas de Case (`/cases/[slug]`) — Design

**Data:** 2026-08-26
**Status:** Aprovado, aguardando plano de implementação

## Contexto

A auditoria completa do site (2026-08-26) apontou como achado crítico: todo
card de case em `components/sections/Cases.tsx` já aponta para
`/cases/${c.slug}`, mas essa rota não existe — hoje é um 404 do Next.js para
qualquer visitante que clique. Este spec cobre só a construção dessa página
de detalhe. A página de listagem `/cases` (também referenciada pelo link "Ver
todos os cases" da home) fica fora de escopo por decisão explícita do
cliente — permanece um link não-funcional por enquanto.

## Fonte de conteúdo e limite ético

Dos 11 cases em `lib/content.ts`, só 3 têm `foto` e `resumo` reais:
`atelie-materno`, `maria-head-hair`, `expresso-nepomuceno`. São empresas
reais e identificáveis — **nenhum número de resultado, citação de cliente,
ou fato não presente no `resumo` já escrito pode ser inventado**. O cliente
confirmou que tem dados reais (resultado, depoimento) e vai fornecê-los
depois de ver o protótipo funcionando.

Consequência de design: o corpo da página usa o `resumo` existente como está
(sem reescrita que possa introduzir nuance nova), e as seções de "Resultados"
e "Depoimento" são condicionais — só renderizam quando o dado existir no
conteúdo. Hoje, para os 3 cases reais, ficam ocultas. A estrutura já nasce
pronta para recebê-las.

## Escopo

- Rota dinâmica para os **11** slugs conhecidos.
- Os 3 cases com `foto`+`resumo`: página completa (hero, corpo, CTA, navegação).
- Os 8 cases restantes: página mais simples ("case em produção"), `noindex`
  para não pesar no SEO com conteúdo fino (achado #4 da auditoria).
- Fora de escopo: página `/cases` (listagem), LGPD, qualquer outro item do
  roadmap da auditoria.

## Direção visual — hero com "caixa dentro da foto"

Referência: o próprio card de case da home (`Cases.tsx:57-97`) já usa esse
padrão — foto full-bleed + gradiente escuro (`bg-gradient-to-t from-ink/85
via-ink/10 to-ink/25`) + uma caixa ancorada na parte de baixo da imagem com
nome do cliente e badge de serviço. A página de case escala esse mesmo
padrão para o momento de abertura da página (hero), no lugar de repeti-lo
como card pequeno:

- Foto full-bleed do case, tratamento de cantos arredondados como o Hero da
  home (`components/sections/Hero.tsx`: `p-[1.6rem]` de respiro externo,
  `rounded-[2.4rem]` no painel interno).
- Gradiente escuro por baixo, mesmo princípio do card da home.
- Caixa de informação ancorada no canto inferior esquerdo da foto: nome do
  cliente (título grande), badge do serviço (mesmo estilo `bg-paper/20
  backdrop-blur` já usado no card).
- Um link "← Voltar para cases" sobreposto no canto superior da foto.

Para os 8 cases sem foto: mesma estrutura de hero, mas usando
`components/ui/MediaPlaceholder.tsx` (já existe no projeto) no lugar da
`<Image>`, sem quebrar o layout.

## Estrutura da página (cases com conteúdo real)

1. **Hero** — descrito acima.
2. **Sobre o projeto** — título de seção + o `resumo` do case, renderizado
   como está, sem reescrita.
3. **Resultados** *(condicional)* — grid de chips numéricos. Só renderiza se
   `case.resultados` existir no conteúdo.
4. **Depoimento** *(condicional)* — bloco de citação, reaproveitando o
   estilo visual de `components/sections/Testimonials.tsx` (aspas grandes,
   avatar com iniciais). Só renderiza se `case.depoimento` existir.
5. **CTA final** — convite para o formulário de diagnóstico, link para
   `/#diagnostico` (a seção construída no ciclo anterior).
6. **Próximo case** — link de navegação para o próximo case da lista (por
   índice no array `cases`, ciclando de volta ao primeiro no final),
   inspirado no "Next case" do awsmd.

## Estrutura da página (8 cases sem foto/copy)

Uma versão reduzida: nome do cliente, badge de serviço, hero com
`MediaPlaceholder`, uma frase padrão ("Este case está em produção — em
breve, o resultado completo.") e o mesmo CTA final. `generateMetadata`
retorna `robots: { index: false }` para essas páginas.

## Modelo de conteúdo

Extensão opcional em `lib/content.ts`, no array `cases` (mantém `as const`,
segue o mesmo padrão de campos opcionais que `foto`/`resumo` já usam — não é
uma mudança de shape obrigatória, só dois campos novos que passam a existir
quando fornecidos):

```typescript
resultados?: readonly { label: string; valor: string }[];
depoimento?: { texto: string; nome: string; cargo: string };
```

Nenhum dado é adicionado a essas duas chaves agora — ficam disponíveis para
quando o cliente enviar o material real.

## Arquitetura

```
app/cases/[slug]/page.tsx         — Server Component, generateStaticParams,
                                     generateMetadata, notFound() para slug
                                     desconhecido
components/sections/CaseHero.tsx  — o hero com foto + caixa (ou placeholder)
components/sections/CaseBody.tsx  — corpo: sobre o projeto + resultados
                                     condicionais + depoimento condicional
```

`page.tsx` busca o case por slug em `cases` (de `lib/content.ts`), chama
`notFound()` se não existir, e decide entre o layout completo ou o reduzido
checando `"foto" in caso && caso.foto`.

## Erros

- Slug fora da lista conhecida → `notFound()` (página 404 padrão do Next.js).
- Nenhuma chamada de rede nesta feature — conteúdo é 100% estático, vindo de
  `lib/content.ts`. Sem estado de carregamento ou erro de runtime a tratar.

## Testes

Sem suíte automatizada no projeto — verificação manual no navegador:
visitar um slug de case real (confere hero, corpo, resultados/depoimento
ocultos, CTA, next-case), um slug de case placeholder (confere aviso +
`noindex`), e um slug inventado (confere página 404).
