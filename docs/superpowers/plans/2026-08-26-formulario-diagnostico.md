# Formulário de Diagnóstico Gratuito Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `mailto:` CTA with a real lead-capture form on the home page, integrated with RD Station Marketing, in the "Convite direto" visual direction the client approved.

**Architecture:** A new page section (`Diagnostico.tsx`, client component) submits via a React 19 `useActionState` hook to a Next.js Server Action (`enviarLead`), which validates with Zod, applies a honeypot + basic in-memory rate limit, then calls an isolated RD Station client (`lib/rdstation.ts`). No new API routes.

**Tech Stack:** Next.js 16 App Router, React 19 (`useActionState`), Zod (new dependency), Tailwind v4 tokens already defined in `app/globals.css`, GSAP-backed `RevealOnScroll` for entrance motion.

**Spec:** [docs/superpowers/specs/2026-08-26-formulario-diagnostico-design.md](../specs/2026-08-26-formulario-diagnostico-design.md)

## Global Constraints

- No automated test framework exists in this repo (`package.json` has no test script, no jest/vitest config). Every task's verification step is a **manual check** — either in the running dev server via the browser tools, or via `curl`/`node -e` for pure server-side logic. This replaces the pytest-style steps from the standard task template.
- Follow the existing content pattern: **all copy lives in `lib/content.ts`**, never hardcoded in a component.
- Follow the existing spacing/token pattern: colors and fonts come from CSS custom properties in `app/globals.css` + the `@theme inline` block, consumed as Tailwind utilities (`text-azul`, `bg-ground`, etc.) — never a raw hex value in a component.
- Follow the existing motion pattern: entrance animation via `components/motion/RevealOnScroll.tsx` (already used in Cases, Blog, Testimonials, Showcase), not a new one-off animation approach.
- Respect `prefers-reduced-motion` for every new animation, matching every existing animated component in this codebase.
- The Google Drive-synced project folder corrupts `npm install` when run directly inside it (documented in `AJUSTES.md`) — install new dependencies in a local scratch directory and copy the resolved package into `node_modules`, exactly as done previously for `gsap`/`lenis`.
- `RD_STATION_IDENTIFIER` (the account's public conversion identifier) and a real WhatsApp number are **client-supplied values**, not something to invent. Code must read them from config (env var / `lib/content.ts`) with an obvious placeholder that a human replaces before going live — never silently fabricate a working-looking fake value that could ship unnoticed.

---

## Task 1: Add the `erro` color token

**Files:**
- Modify: `app/globals.css:85-108` (the `:root` token block), `app/globals.css:118-130` (the `@theme inline` block)

**Interfaces:**
- Produces: Tailwind utility classes `text-erro`, `bg-erro`, `border-erro` usable by any component — the same wiring pattern every other brand color already uses.

- [ ] **Step 1: Add the CSS custom property**

In `app/globals.css`, inside the existing `:root { ... }` block, add the new token next to the other semantic colors:

```css
  --sinal: #ffc400;
  --erro: #c1121f;
  --muted: #6b7583;
```

- [ ] **Step 2: Wire it into the Tailwind theme**

In the same file, inside the existing `@theme inline { ... }` block:

```css
  --color-sinal: var(--sinal);
  --color-erro: var(--erro);
  --color-muted: var(--muted);
```

- [ ] **Step 3: Verify manually**

Run the dev server (`npm run dev` if not already running) and in the browser console on `http://localhost:3000` run:

```js
getComputedStyle(document.documentElement).getPropertyValue('--erro').trim()
```

Expected: `"#c1121f"`.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "Add erro color token for form validation states"
```

---

## Task 2: Install Zod

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install in a local scratch directory**

The project folder is Google-Drive-synced and `npm install` run directly inside it has previously corrupted `package.json` (see `AJUSTES.md`). Install in a fast local directory first:

```bash
mkdir -p /tmp/beeon-zod-install && cd /tmp/beeon-zod-install && npm init -y >/dev/null && npm install zod@^3
```

- [ ] **Step 2: Copy the resolved package into the project**

```bash
cp -r /tmp/beeon-zod-install/node_modules/zod "G:/Meu Drive/Novo Site Beeon/Novo-site-Beeon/node_modules/zod"
```

- [ ] **Step 3: Add it to `package.json` dependencies by hand**

Open `package.json` and add to the `dependencies` object (keep alphabetical order with the existing entries):

```json
    "zod": "^3.24.1",
```

- [ ] **Step 4: Verify manually**

```bash
cd "G:/Meu Drive/Novo Site Beeon/Novo-site-Beeon" && node -e "const {z} = require('zod'); console.log(z.string().email().safeParse('a@b.com').success)"
```

Expected: `true` printed, no error.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add zod for form validation"
```

---

## Task 3: RD Station client

**Files:**
- Create: `lib/rdstation.ts`

**Interfaces:**
- Produces: `enviarParaRDStation(lead: LeadValidado): Promise<void>` and `RDStationError` — consumed by Task 4's Server Action. `LeadValidado` is `{ nome: string; whatsapp: string; email: string; empresa: string }`.

- [ ] **Step 1: Write the client**

Create `lib/rdstation.ts`:

```typescript
/**
 * Cliente isolado da API pública de conversão do RD Station Marketing.
 * Único arquivo que conhece o identificador de conta e o formato do payload.
 */

const RD_STATION_CONVERSION_URL = "https://www.rdstation.com.br/api/1.3/conversions";

export type LeadValidado = {
  nome: string;
  whatsapp: string;
  email: string;
  empresa: string;
};

export class RDStationError extends Error {}

export async function enviarParaRDStation(lead: LeadValidado): Promise<void> {
  const token = process.env.RD_STATION_IDENTIFIER;
  if (!token) {
    throw new RDStationError(
      "RD_STATION_IDENTIFIER não configurado. Copie .env.example para .env.local e cole o identificador público de conversão da conta RD Station."
    );
  }

  const response = await fetch(RD_STATION_CONVERSION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token_rdstation: token,
      identificador: "diagnostico-gratuito-site",
      email: lead.email,
      nome: lead.nome,
      cf_whatsapp: lead.whatsapp,
      cf_empresa: lead.empresa,
    }),
  });

  if (!response.ok) {
    throw new RDStationError(`RD Station respondeu ${response.status} ${response.statusText}`);
  }
}
```

- [ ] **Step 2: Verify manually**

```bash
cd "G:/Meu Drive/Novo Site Beeon/Novo-site-Beeon" && node -e "
const { RDStationError } = require('./lib/rdstation.ts');
" 2>&1 | head -5
```

This will fail with a module-type error since it's TypeScript run directly — that's expected and fine. Instead verify via the TypeScript compiler:

```bash
npx tsc --noEmit lib/rdstation.ts --esModuleInterop --target es2020 --module esnext --moduleResolution bundler
```

Expected: no output (no type errors). A real end-to-end check happens in Task 8 once `RD_STATION_IDENTIFIER` is set.

- [ ] **Step 3: Commit**

```bash
git add lib/rdstation.ts
git commit -m "Add isolated RD Station conversion API client"
```

---

## Task 4: Server Action with validation, honeypot, and rate limit

**Files:**
- Create: `lib/actions/enviar-lead.ts`

**Interfaces:**
- Consumes: `enviarParaRDStation`, `RDStationError`, `LeadValidado` from `lib/rdstation.ts` (Task 3).
- Produces: `enviarLead(prevState: EnviarLeadState, formData: FormData): Promise<EnviarLeadState>` and the `EnviarLeadState` type — consumed by Task 5's `useActionState` call. Form field names it reads from `FormData`: `nome`, `whatsapp`, `email`, `empresa`, `website` (honeypot).

- [ ] **Step 1: Write the Server Action**

Create `lib/actions/enviar-lead.ts`:

```typescript
"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { enviarParaRDStation, RDStationError } from "@/lib/rdstation";

const leadSchema = z.object({
  nome: z.string().trim().min(2, "Digite seu nome completo."),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/, "Digite um WhatsApp válido com DDD."),
  email: z.string().trim().email("Digite um e-mail válido."),
  empresa: z.string().trim().min(2, "Digite o nome da sua empresa."),
});

type CampoLead = "nome" | "whatsapp" | "email" | "empresa";

export type EnviarLeadState =
  | { status: "idle" }
  | { status: "erro_validacao"; erros: Partial<Record<CampoLead, string>> }
  | { status: "erro_envio" }
  | { status: "sucesso" };

// Limite básico por IP. Em memória por instância de servidor: suficiente para
// o volume esperado deste site, mas não é uma garantia forte em ambientes
// serverless com múltiplas instâncias simultâneas — se o tráfego crescer,
// trocar por um rate limit compartilhado (ex.: Upstash Redis).
const JANELA_MS = 10 * 60 * 1000;
const LIMITE_ENVIOS = 5;
const enviosPorIp = new Map<string, { count: number; resetAt: number }>();

function excedeuLimite(ip: string): boolean {
  const agora = Date.now();
  const registro = enviosPorIp.get(ip);
  if (!registro || agora > registro.resetAt) {
    enviosPorIp.set(ip, { count: 1, resetAt: agora + JANELA_MS });
    return false;
  }
  registro.count += 1;
  return registro.count > LIMITE_ENVIOS;
}

export async function enviarLead(
  _estadoAnterior: EnviarLeadState,
  formData: FormData
): Promise<EnviarLeadState> {
  // Honeypot: campo invisível que só um bot preenche. Retorna sucesso
  // "falso" — não entrega ao RD Station, mas também não avisa o bot de
  // que foi bloqueado, o que evitaria uma nova tentativa mais sofisticada.
  if (formData.get("website")) {
    return { status: "sucesso" };
  }

  const cabecalhos = await headers();
  const ip = cabecalhos.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconhecido";
  if (excedeuLimite(ip)) {
    return { status: "sucesso" };
  }

  const resultado = leadSchema.safeParse({
    nome: formData.get("nome"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    empresa: formData.get("empresa"),
  });

  if (!resultado.success) {
    const erros: Partial<Record<CampoLead, string>> = {};
    for (const issue of resultado.error.issues) {
      const campo = issue.path[0];
      if (typeof campo === "string") {
        erros[campo as CampoLead] = issue.message;
      }
    }
    return { status: "erro_validacao", erros };
  }

  try {
    await enviarParaRDStation(resultado.data);
    return { status: "sucesso" };
  } catch (erro) {
    console.error(
      "Falha ao enviar lead para o RD Station:",
      erro instanceof RDStationError ? erro.message : erro
    );
    return { status: "erro_envio" };
  }
}
```

- [ ] **Step 2: Verify the validation logic manually**

```bash
cd "G:/Meu Drive/Novo Site Beeon/Novo-site-Beeon" && node -e "
const { z } = require('zod');
const schema = z.object({
  nome: z.string().trim().min(2),
  whatsapp: z.string().trim().regex(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}\$/),
  email: z.string().trim().email(),
  empresa: z.string().trim().min(2),
});
console.log('valido:', schema.safeParse({nome:'Ana Silva', whatsapp:'(16) 99999-8888', email:'ana@empresa.com', empresa:'Empresa X'}).success);
console.log('invalido (email ruim):', schema.safeParse({nome:'Ana Silva', whatsapp:'(16) 99999-8888', email:'nao-e-email', empresa:'Empresa X'}).success);
"
```

Expected: `valido: true` then `invalido (email ruim): false`.

- [ ] **Step 3: Commit**

```bash
git add lib/actions/enviar-lead.ts
git commit -m "Add enviarLead server action with validation, honeypot, and rate limit"
```

---

## Task 5: Content entries

**Files:**
- Modify: `lib/content.ts`

**Interfaces:**
- Produces: `diagnostico` export (`{ eyebrow, titulo, subtitulo, confianca }`) and `site.whatsappHref` — consumed by Task 6's `Diagnostico.tsx`. Modifies `site.ctaHref`. Removes `footer.ctaTitulo` / `footer.ctaTexto` (Task 7 removes their only usage).

- [ ] **Step 1: Update `site` and add `diagnostico`**

In `lib/content.ts`, change `ctaHref` and add `whatsappHref` to the existing `site` object:

```typescript
export const site = {
  nome: "Beeon",
  local: "Ribeirão Preto/SP · Passos/MG",
  cta: "Diagnóstico gratuito",
  ctaHref: "#diagnostico",
  headerCta: "Falar com um especialista",
  email: "contato@beeon.com.br",
  // TODO: substituir pelo número real de WhatsApp da Beeon antes de publicar.
  whatsappHref: "https://wa.me/5516999999999",
};
```

Add a new export right after `hero`:

```typescript
export const diagnostico = {
  eyebrow: "07 — Diagnóstico gratuito",
  titulo: "Vamos achar onde seu marketing está perdendo receita.",
  subtitulo:
    "15 minutos de conversa, sem compromisso. Nossa equipe analisa seu cenário atual e te devolve um plano — não um pitch de venda.",
  confianca: ["Resposta em até 1 dia útil", "Sem letra miúda"],
};
```

- [ ] **Step 2: Remove the now-unused footer CTA copy**

In the `footer` object, delete these two lines (Task 7 removes the only place that renders them):

```typescript
  ctaTitulo: "Diagnóstico gratuito",
  ctaTexto: "Fale com a Beeon e descubra onde o seu marketing está perdendo receita.",
```

- [ ] **Step 3: Verify manually**

```bash
cd "G:/Meu Drive/Novo Site Beeon/Novo-site-Beeon" && node -e "
const ts = require('fs').readFileSync('lib/content.ts', 'utf8');
console.log('ctaHref ok:', ts.includes('ctaHref: \"#diagnostico\"'));
console.log('diagnostico export ok:', ts.includes('export const diagnostico'));
console.log('ctaTitulo removed:', !ts.includes('ctaTitulo:'));
"
```

Expected: all three lines print `true`.

- [ ] **Step 4: Commit**

```bash
git add lib/content.ts
git commit -m "Add diagnostico content, whatsappHref, repoint site.ctaHref"
```

---

## Task 6: `Diagnostico.tsx` section component

**Files:**
- Create: `components/sections/Diagnostico.tsx`

**Interfaces:**
- Consumes: `enviarLead`, `EnviarLeadState` from `lib/actions/enviar-lead.ts` (Task 4); `diagnostico`, `site` from `lib/content.ts` (Task 5); `RevealOnScroll` from `components/motion/RevealOnScroll.tsx` (existing, signature `{ children, className?, delay?, y?, duration?, as? }`).
- Produces: default export `Diagnostico` (React component, no props) — consumed by Task 7's `app/page.tsx`.

- [ ] **Step 1: Write the component**

Create `components/sections/Diagnostico.tsx`:

```tsx
"use client";

import { useActionState } from "react";
import { enviarLead, type EnviarLeadState } from "@/lib/actions/enviar-lead";
import { diagnostico, site } from "@/lib/content";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

const ESTADO_INICIAL: EnviarLeadState = { status: "idle" };

export default function Diagnostico() {
  const [estado, formAction, pendente] = useActionState(enviarLead, ESTADO_INICIAL);
  const erros = estado.status === "erro_validacao" ? estado.erros : {};

  return (
    <section
      id="diagnostico"
      className="site-max"
      style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}
    >
      <div className="site-grid items-end gap-y-[3.2rem]">
        <RevealOnScroll className="col-span-12 lg:col-span-6" y={3.2}>
          <p className="font-mono text-[1.2rem] uppercase tracking-[0.08em] text-azul mb-[1.4rem]">
            {diagnostico.eyebrow}
          </p>
          <h2 className="font-display font-extrabold text-[clamp(2.8rem,4.6vw,4.8rem)] leading-[1.03] tracking-[-0.02em] text-balance mb-[1.6rem]">
            {diagnostico.titulo}
          </h2>
          <p className="font-mono text-[1.2rem] leading-[1.5] text-muted max-w-[38rem]">
            {diagnostico.subtitulo}
          </p>
          <div className="flex flex-wrap gap-x-[2.4rem] gap-y-[0.8rem] mt-[2rem] font-mono text-[1.1rem] text-muted">
            {diagnostico.confianca.map((item) => (
              <span key={item} className="flex items-center gap-[0.7rem]">
                <span className="h-[0.6rem] w-[0.6rem] rounded-full bg-sinal" aria-hidden />
                {item}
              </span>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="col-span-12 lg:col-span-6" y={3.2} delay={0.12}>
          <div className="relative rounded-[1.4rem] border border-rule bg-ground p-[2.4rem] sm:p-[3.2rem] overflow-hidden">
            {estado.status === "sucesso" ? (
              <div key="sucesso" className="diagnostico-swap">
                <p className="font-display font-semibold text-[1.8rem] leading-[1.3] mb-[1rem]">
                  Recebemos seu diagnóstico. 🐝
                </p>
                <p className="font-mono text-[1.2rem] text-muted mb-[2rem]">
                  Alguém da equipe fala com você em até 1 dia útil. Se preferir não esperar:
                </p>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-[0.7rem] bg-ink px-[2rem] py-[1.15rem] font-display font-bold text-[1rem] text-paper hover:bg-azul transition-colors"
                >
                  Chamar no WhatsApp agora
                </a>
              </div>
            ) : (
              <form key="form" action={formAction} className="diagnostico-swap" noValidate>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
                />

                <Campo label="Seu nome" name="nome" type="text" placeholder="Como podemos te chamar?" erro={erros.nome} />
                <Campo label="WhatsApp" name="whatsapp" type="tel" placeholder="(16) 90000-0000" erro={erros.whatsapp} />
                <Campo label="E-mail" name="email" type="email" placeholder="voce@empresa.com" erro={erros.email} />
                <Campo label="Empresa" name="empresa" type="text" placeholder="Nome da sua empresa" erro={erros.empresa} last />

                {estado.status === "erro_envio" && (
                  <p className="font-mono text-[1.05rem] text-erro mt-[1.2rem]">
                    Não conseguimos enviar agora. Tente de novo ou chame no{" "}
                    <a href={site.whatsappHref} className="underline">
                      WhatsApp
                    </a>
                    .
                  </p>
                )}

                <button
                  type="submit"
                  disabled={pendente}
                  className="w-full mt-[1.6rem] rounded-[0.7rem] bg-ink px-[2rem] py-[1.15rem] font-display font-bold text-[1rem] text-paper hover:bg-azul transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {pendente ? "Enviando..." : "Quero meu diagnóstico →"}
                </button>
              </form>
            )}
          </div>
        </RevealOnScroll>
      </div>

      <style>{`
        .diagnostico-swap {
          animation: diagnostico-swap 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes diagnostico-swap {
          from { opacity: 0; transform: translateY(1.2rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .diagnostico-swap { animation: none; }
        }
      `}</style>
    </section>
  );
}

function Campo({
  label,
  name,
  type,
  placeholder,
  erro,
  last,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  erro?: string;
  last?: boolean;
}) {
  return (
    <div className={`py-[1.1rem] ${last ? "" : "border-b border-rule"}`}>
      <label
        htmlFor={name}
        className="block font-mono text-[0.72rem] uppercase tracking-[0.06em] text-muted mb-[0.4rem]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="w-full bg-transparent font-mono text-[1.15rem] font-medium text-ink outline-none placeholder:text-muted/70"
      />
      {erro && <p className="font-mono text-[0.85rem] text-erro mt-[0.5rem]">{erro}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Verify manually in the browser**

With the dev server running, navigate to `http://localhost:3000#diagnostico` (this will 404-scroll harmlessly until Task 7 wires the section into the page — skip live verification here and do it as part of Task 7's step instead).

- [ ] **Step 3: Commit**

```bash
git add components/sections/Diagnostico.tsx
git commit -m "Add Diagnostico section component with entrance animation"
```

---

## Task 7: Wire the section into the page, remove the old Footer CTA

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/sections/Footer.tsx`

**Interfaces:**
- Consumes: `Diagnostico` default export from Task 6.

- [ ] **Step 1: Insert the section into the page**

In `app/page.tsx`, add the import and place `<Diagnostico />` between `<Blog />` and `<Footer />`:

```tsx
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Showcase from "@/components/sections/Showcase";
import Stats from "@/components/sections/Stats";
import Cases from "@/components/sections/Cases";
import Method from "@/components/sections/Method";
import Testimonials from "@/components/sections/Testimonials";
import Blog from "@/components/sections/Blog";
import Diagnostico from "@/components/sections/Diagnostico";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Showcase />
        <Stats />
        <Cases />
        <Method />
        <Testimonials />
        <Blog />
        <Diagnostico />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Remove the old CTA block from `Footer.tsx`**

In `components/sections/Footer.tsx`, delete this block (the first `<div className="site-grid items-baseline...">` inside the `<footer>`):

```tsx
      <div className="site-grid items-baseline border-t border-ink pt-[3.2rem] pb-[3.2rem]">
        <RevealTitle
          as="h2"
          className="col-span-12 lg:col-span-6 font-display font-semibold text-[clamp(3.4rem,5vw,5.2rem)] leading-[1.05] tracking-[-0.02em]"
        >
          {footer.ctaTitulo}
        </RevealTitle>
        <div className="col-span-12 lg:col-span-6 mt-[2rem] lg:mt-0">
          <p className="font-mono text-[1.4rem] text-muted mb-[1.6rem] max-w-[36rem]">
            {footer.ctaTexto}
          </p>
          <a
            href={site.ctaHref}
            className="inline-block rounded-full bg-azul px-[2.6rem] py-[1.3rem] font-mono text-[1.3rem] font-medium text-paper hover:bg-azul-dim transition-colors"
          >
            {site.email}
          </a>
        </div>
      </div>

```

The `<footer id="contato" ...>` opening tag stays (nav's "Contato" link still needs `#contato` to resolve), and the two remaining blocks (sitemap/socials, and logo/back-to-top/copyright) stay untouched.

Remove the now-unused `RevealTitle` import at the top of the file (it was only used by the deleted block):

```tsx
import Image from "next/image";
import { footer, site } from "@/lib/content";
```

- [ ] **Step 3: Verify manually in the browser**

With the dev server running:
1. Navigate to `http://localhost:3000`, scroll to the new section between the Blog and the Footer.
2. Confirm the two columns fade/rise into view as you scroll to them (not instantly visible on load).
3. Submit the form with an invalid email (e.g. `nome=Teste`, `whatsapp=(16) 99999-8888`, `email=nao-e-email`, `empresa=Teste`) and confirm an inline error appears under the E-mail field, in the red `erro` color, without a page reload.
4. Fix the email and submit again. Since `RD_STATION_IDENTIFIER` is not set yet (Task 8), confirm the panel shows the generic error state ("Não conseguimos enviar agora...") rather than crashing, and that the dev server terminal logs `Falha ao enviar lead para o RD Station: RD_STATION_IDENTIFIER não configurado...`.
5. Click the header's "Falar com um especialista" and the mobile menu's CTA — both should now scroll to this new section, not to the footer.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/sections/Footer.tsx
git commit -m "Wire Diagnostico section into the home page, remove old mailto CTA from footer"
```

---

## Task 8: Environment variable documentation

**Files:**
- Create: `.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Allow `.env.example` through the `.env*` ignore rule**

In `.gitignore`, right after the existing `.env*` line, add:

```gitignore
.env*
!.env.example
```

- [ ] **Step 2: Create the example file**

Create `.env.example`:

```
# Identificador público de conversão da conta RD Station Marketing da Beeon.
# Encontrado em: RD Station > Integrações > Central de Automação > API de Conversões.
RD_STATION_IDENTIFIER=
```

- [ ] **Step 3: Verify manually**

```bash
cd "G:/Meu Drive/Novo Site Beeon/Novo-site-Beeon" && git check-ignore -v .env.example
```

Expected: no output / non-zero exit (confirms the file is NOT ignored, so it will be tracked).

- [ ] **Step 4: Commit**

```bash
git add .gitignore .env.example
git commit -m "Document RD_STATION_IDENTIFIER as a required environment variable"
```

---

## Self-Review Notes

- **Spec coverage:** visual direction (Task 6), 4 fields with validation (Task 4 schema), honeypot (Task 4 + 6), rate limit (Task 4), RD Station integration (Task 3), post-submit inline message + WhatsApp (Task 6), error handling with no dead end (Task 6), `site.ctaHref` repoint (Task 5), position before Footer replacing its old CTA (Task 7). All spec sections have a task.
- **Placeholder scan:** the only literal placeholders are `RD_STATION_IDENTIFIER` (empty in `.env.example`, by design — Task 8) and the fake WhatsApp number in `lib/content.ts` (flagged with an inline `TODO` comment, by design per Global Constraints) — both are client-supplied values, not deferred engineering work.
- **Type consistency:** `EnviarLeadState` defined once in Task 4, imported (not redefined) in Task 6. `LeadValidado` defined once in Task 3, used as `enviarParaRDStation`'s parameter type and matches the shape of `leadSchema`'s parsed output in Task 4. Field names (`nome`, `whatsapp`, `email`, `empresa`, `website`) are consistent across Tasks 4 and 6.
