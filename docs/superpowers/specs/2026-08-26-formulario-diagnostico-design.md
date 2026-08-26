# Formulário de Diagnóstico Gratuito — Design

**Data:** 2026-08-26
**Status:** Aprovado, aguardando plano de implementação

## Contexto

O site Beeon hoje não tem nenhum formulário de captura de lead. O CTA principal
("Falar com um especialista") e o CTA do rodapé ("Diagnóstico gratuito") apontam
para `mailto:contato@beeon.com.br` — identificado como o achado crítico #1 da
auditoria completa do site (ver conversa / relatório publicado em
2026-08-26). Isso significa zero rastreamento de conversão e dependência de o
visitante ter um cliente de e-mail configurado no dispositivo.

Este spec cobre apenas a construção do formulário e sua integração com o
RD Station Marketing — não cobre LGPD/política de privacidade nem as demais
fases do roadmap da auditoria, que são sub-projetos separados.

## Objetivo

Substituir o CTA de `mailto:` por uma seção de formulário real, embutida na
página inicial, que capture lead qualificado e envie para o RD Station
Marketing (CRM que a Beeon já usa para si mesma).

## Direção visual

Opção "Convite direto" (inspirada em awsmd.com), escolhida entre 3 protótipos
apresentados ao cliente:

- Coluna esquerda: eyebrow numerado (`07 — Diagnóstico gratuito`), título forte,
  subtítulo curto, duas linhas de confiança (prazo de resposta, "sem letra
  miúda").
- Coluna direita: painel claro (`bg-ground`, `border-rule`, `rounded-[1.4rem]`)
  com os 4 campos empilhados e botão de envio de largura total — consistente
  com o restante do sistema de design do Beeon (`site-max`, tokens de
  `globals.css`, fonte Nohemi/Inter).
- Substitui o CTA de `mailto:` atualmente em `components/sections/Footer.tsx`.
  A seção entra como novo componente de página, entre `Testimonials` e `Blog`
  ou logo antes do `Footer` (posição exata a decidir na implementação,
  olhando o ritmo de scroll da página).
- `site.ctaHref` em `lib/content.ts` passa de `#contato` para `#diagnostico`.

## Campos do formulário

Conjunto "Essencial" (4 campos), todos obrigatórios:

| Campo | Tipo | Validação |
|---|---|---|
| Nome | texto | mínimo 2 caracteres |
| WhatsApp | telefone | formato BR, com DDD |
| E-mail | e-mail | formato de e-mail válido |
| Empresa | texto | mínimo 2 caracteres |

## Arquitetura

Novo componente de seção + uma Server Action do Next.js (App Router) — sem
rota de API separada. Aprovado sobre as alternativas "direto do navegador
para o RD Station" (sem validação de servidor) e "rota de API dedicada"
(mesmo resultado, mais boilerplate).

```
components/sections/Diagnostico.tsx   — seção da página (client component)
lib/actions/enviar-lead.ts            — Server Action ('use server')
lib/rdstation.ts                      — cliente isolado da API do RD Station
```

### `Diagnostico.tsx`

- Client component: precisa de estado local para o ciclo
  `idle → enviando → sucesso → erro`.
- Renderiza os 4 campos + um campo honeypot invisível (`aria-hidden`, fora do
  fluxo de tab, nome de campo não-óbvio tipo `website`).
- Em `sucesso`, troca o conteúdo do painel por uma mensagem de confirmação
  ("Recebemos, alguém fala com você em até 1 dia útil") + botão de WhatsApp
  (decisão de pós-envio já aprovada: "mensagem inline + WhatsApp").
- Em `erro`, mostra mensagem pedindo para tentar de novo ou chamar direto no
  WhatsApp — nunca um beco sem saída.
- Usa `<form action={enviarLead}>` (Server Action ligada diretamente ao form,
  padrão nativo do App Router — funciona com progressive enhancement mesmo
  sem JS).

### `lib/actions/enviar-lead.ts`

- `'use server'`.
- Schema Zod: `nome`, `whatsapp`, `email`, `empresa` (ver tabela acima) +
  campo honeypot (deve chegar vazio).
- **Honeypot preenchido** → retorna estado de sucesso "falso" sem chamar o
  RD Station (não entrega ao bot que foi bloqueado, evita nova tentativa
  automatizada).
- **Rate limit** → contador simples em memória por IP (via header
  `x-forwarded-for` / `request.headers`), N envios por janela de tempo
  (parâmetro a definir na implementação — algo como 5 por 10 minutos é
  razoável para o volume esperado deste site). Estourar o limite também
  retorna sucesso silencioso, mesmo raciocínio do honeypot.
- Validação falha (campo vazio/formato errado) → retorna erros por campo.
- Validação ok → chama `enviarParaRDStation(lead)`. Falha na chamada → estado
  de erro genérico para o usuário; falha é logada no servidor (sem PII em
  excesso, alinhado com a diretriz de logging da auditoria de segurança).

### `lib/rdstation.ts`

- Única função: `enviarParaRDStation(lead: LeadValidado): Promise<void>`.
- Único lugar do código que conhece `process.env.RD_STATION_IDENTIFIER`
  (identificador público de conversão da conta RD Station da Beeon — já
  existe, será fornecido pelo cliente antes de publicar; até lá a variável
  fica ausente e a Server Action deve falhar de forma clara e log-ável, não
  silenciosa).
- Chama o endpoint de conversão pública do RD Station Marketing (payload:
  identificador + campos do lead mapeados para os nomes de campo que a conta
  RD Station espera — confirmar nomes exatos dos campos no RD Station na
  implementação).

## Fluxo de dados

```
usuário preenche → submit (Server Action)
  → honeypot preenchido?        → sucesso silencioso (sem envio real)
  → rate limit estourado?       → sucesso silencioso (sem envio real)
  → validação Zod falha?        → erro por campo, formulário permanece preenchido
  → válido → chama RD Station
       → RD Station ok          → estado de sucesso real + WhatsApp
       → RD Station falha       → estado de erro genérico + link de WhatsApp
```

## Fora de escopo (sub-projetos separados, já mapeados na auditoria)

- Página/banner de política de privacidade e consentimento de cookies (LGPD)
  — necessário assim que este formulário for ao ar, mas é spec próprio.
- Botão flutuante de WhatsApp (CTA persistente, item separado do roadmap).
- Qualquer alteração nos links de redes sociais do rodapé.

## Testes

Sem suíte automatizada no projeto — consistente com o restante do código.
Verificação manual no navegador local: preencher e enviar com dados válidos
(estado de sucesso), campo obrigatório vazio (erro por campo), e-mail com
formato inválido (erro por campo), e confirmar que o honeypot barra um envio
com aquele campo preenchido via JS no console (não há como simular um bot
real, mas dá para confirmar que o caminho de código está correto).
