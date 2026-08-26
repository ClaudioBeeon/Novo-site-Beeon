# Páginas de Case Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every case in `lib/content.ts` a working `/cases/[slug]` page instead of the 404 the site currently serves for all 11 case links, using the awsmd-inspired "photo with an info box anchored at the bottom" hero.

**Architecture:** A dynamic App Router route (`app/cases/[slug]/page.tsx`) composes two new presentational components — `CaseHero` (the photo/box hero, or a placeholder for cases without a real photo) and `CaseBody` (narrative text + conditional results/testimonial sections + CTA + next-case link). No new content data is added: the two optional fields (`resultados`, `depoimento`) are read defensively so the page works today and lights up automatically once real data is added to `lib/content.ts` later.

**Tech Stack:** Next.js 16 App Router (async `params`, `generateStaticParams`, `generateMetadata`), existing `RevealOnScroll` motion component, existing `MediaPlaceholder` component, Tailwind v4 tokens from `app/globals.css`.

**Spec:** [docs/superpowers/specs/2026-08-26-paginas-de-case-design.md](../specs/2026-08-26-paginas-de-case-design.md)

## Global Constraints

- No automated test framework exists in this repo. Every task's verification step is a **manual check** — TypeScript compiler for type correctness, browser tools for rendered behavior.
- All copy comes from `lib/content.ts` as it exists today — **no invented client results, quotes, or facts**. The 8 cases without `foto`/`resumo` show a standard "case em produção" notice, never fabricated content.
- Follow the existing content pattern: colors/fonts via Tailwind utilities backed by `app/globals.css` tokens, never a raw hex value in a component.
- Follow the existing motion pattern: `components/motion/RevealOnScroll.tsx` for scroll-entrance animation, not a new one-off approach.
- Follow the existing sparse-optional-field pattern already used in `components/sections/Cases.tsx` (`"foto" in c && c.foto`) for reading `resultados`/`depoimento`, which may not exist on any given case object.
- `Header` and `Footer` are **not** part of `app/layout.tsx` — the home page (`app/page.tsx`) renders them itself. The new case page must render its own `<Header />` and `<Footer />` too, or it will ship with no navigation or footer at all.

---

## Task 1: `CaseHero` component

**Files:**
- Create: `components/sections/CaseHero.tsx`

**Interfaces:**
- Consumes: `cases` from `lib/content.ts` (only for the `(typeof cases)[number]` type — not for data), `MediaPlaceholder` from `components/ui/MediaPlaceholder.tsx` (signature: `{ label?: string; kind?: "vídeo" | "foto"; className?: string }`).
- Produces: default export `CaseHero({ caso }: { caso: CaseItem })` where `CaseItem = (typeof cases)[number]` — consumed by Task 3's `page.tsx`.

- [ ] **Step 1: Write the component**

Create `components/sections/CaseHero.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import { cases } from "@/lib/content";

type CaseItem = (typeof cases)[number];

export default function CaseHero({ caso }: { caso: CaseItem }) {
  const temFoto = "foto" in caso && !!caso.foto;

  return (
    <section data-hero className="w-full p-[1.6rem]">
      <div className="relative h-[calc(100vh-3.2rem)] min-h-[46rem] w-full overflow-hidden rounded-[2.4rem] bg-ink">
        {temFoto ? (
          <>
            <Image
              src={caso.foto}
              alt={caso.cliente}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/10" />
          </>
        ) : (
          <MediaPlaceholder kind="foto" label={caso.cliente} className="h-full w-full" />
        )}

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-[2.4rem] sm:p-[4rem]">
          <Link
            href="/#cases"
            className="inline-flex w-fit items-center gap-[0.8rem] rounded-full bg-paper/15 backdrop-blur px-[1.6rem] py-[0.9rem] font-mono text-[1.2rem] text-paper hover:bg-paper/25 transition-colors"
          >
            ← Voltar para cases
          </Link>

          <div className="max-w-[60rem] rounded-[1.4rem] bg-paper/10 backdrop-blur-sm p-[2rem] sm:p-[2.8rem]">
            <span className="inline-block rounded-full bg-paper/20 backdrop-blur px-[1.1rem] py-[0.5rem] font-mono text-[0.98rem] text-paper mb-[1.2rem]">
              {caso.servico}
            </span>
            <h1 className="font-display font-semibold uppercase text-paper text-[clamp(2.8rem,6vw,5.6rem)] leading-[1.02] tracking-[-0.02em] text-balance">
              {caso.cliente}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify with TypeScript**

```bash
npx tsc --noEmit --jsx preserve --esModuleInterop --target es2020 --module esnext --moduleResolution bundler --skipLibCheck components/sections/CaseHero.tsx
```

Expected: only `TS2307` "cannot find module '@/...'" errors (path-alias resolution artifact of a standalone invocation without the project's `tsconfig.json`) — no other errors. Any other error (wrong prop name, JSX syntax) must be fixed before moving on.

- [ ] **Step 3: Commit**

```bash
git add components/sections/CaseHero.tsx
git commit -m "Add CaseHero component with photo-and-bottom-box hero pattern"
```

---

## Task 2: `CaseBody` component

**Files:**
- Create: `components/sections/CaseBody.tsx`

**Interfaces:**
- Consumes: `cases` from `lib/content.ts` (type only), `RevealOnScroll` from `components/motion/RevealOnScroll.tsx` (signature: `{ children, className?, delay?, y?, duration?, as? }`).
- Produces: default export `CaseBody({ caso, proximo }: { caso: CaseItem; proximo: CaseItem })` — consumed by Task 3's `page.tsx`. `proximo` is the next case to link to at the bottom of the page.

- [ ] **Step 1: Write the component**

Create `components/sections/CaseBody.tsx`:

```tsx
import Link from "next/link";
import { cases } from "@/lib/content";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

type CaseItem = (typeof cases)[number];

const AVATAR_COR = "#0000FB";

function iniciais(nome: string) {
  return nome.split(" ").map((w) => w[0]).slice(0, 2).join("");
}

export default function CaseBody({ caso, proximo }: { caso: CaseItem; proximo: CaseItem }) {
  return (
    <>
      <section className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
        <div className="site-grid">
          <RevealOnScroll className="col-span-12 lg:col-span-8">
            <h2 className="font-display font-semibold text-[clamp(2rem,2.6vw,2.6rem)] leading-[1.15] tracking-[-0.02em] mb-[1.6rem]">
              Sobre o projeto
            </h2>
            {"resumo" in caso && caso.resumo ? (
              <p className="font-mono text-[1.4rem] leading-[1.6] text-muted max-w-[62rem]">
                {caso.resumo}
              </p>
            ) : (
              <p className="font-mono text-[1.4rem] leading-[1.6] text-muted max-w-[62rem]">
                Este case está em produção — em breve, o resultado completo por aqui.
              </p>
            )}
          </RevealOnScroll>
        </div>
      </section>

      {"resultados" in caso && caso.resultados && caso.resultados.length > 0 && (
        <section className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
          <RevealOnScroll className="site-grid gap-y-[3.2rem]" y={2.4}>
            {caso.resultados.map((r) => (
              <div key={r.label} className="col-span-6 sm:col-span-4">
                <span className="block font-display font-semibold text-[clamp(3.2rem,4.4vw,4.8rem)] leading-none tracking-[-0.02em]">
                  {r.valor}
                </span>
                <p className="mt-[1rem] font-mono text-[1.1rem] text-muted uppercase tracking-[0.04em]">
                  {r.label}
                </p>
              </div>
            ))}
          </RevealOnScroll>
        </section>
      )}

      {"depoimento" in caso && caso.depoimento && (
        <section className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
          <RevealOnScroll className="rounded-[1.4rem] border border-rule bg-paper p-[2.8rem] md:p-[3.6rem]">
            <div className="font-display font-extrabold text-[3.6rem] leading-none text-ink -mb-[0.2rem] -ml-[0.2rem]">
              &ldquo;
            </div>
            <blockquote className="font-display font-medium text-[clamp(1.5rem,1.7vw,1.8rem)] leading-[1.4] tracking-[-0.005em] text-ink text-balance max-w-[62rem]">
              {caso.depoimento.texto}
            </blockquote>
            <div className="flex items-center gap-[1.2rem] mt-[2.4rem]">
              <div
                className="w-[4rem] h-[4rem] rounded-full flex items-center justify-center font-display font-bold text-[1.2rem] shrink-0 text-paper"
                style={{ background: AVATAR_COR }}
              >
                {iniciais(caso.depoimento.nome)}
              </div>
              <div>
                <b className="block font-display font-bold text-[1.3rem] tracking-[-0.005em]">
                  {caso.depoimento.nome}
                </b>
                <span className="font-mono text-[1.05rem] text-muted">{caso.depoimento.cargo}</span>
              </div>
            </div>
          </RevealOnScroll>
        </section>
      )}

      <section className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
        <RevealOnScroll className="rounded-[1.4rem] bg-ink text-paper p-[3.2rem] sm:p-[4.4rem] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[2rem]">
          <h2 className="font-display font-semibold text-[clamp(2.4rem,3.4vw,3.6rem)] leading-[1.1] tracking-[-0.02em] max-w-[36rem] text-balance">
            Quer um resultado assim para o seu negócio?
          </h2>
          <Link
            href="/#diagnostico"
            className="inline-flex w-fit items-center rounded-full bg-paper px-[2.4rem] py-[1.3rem] font-display font-bold text-[1.1rem] text-ink hover:bg-sinal transition-colors"
          >
            Quero meu diagnóstico →
          </Link>
        </RevealOnScroll>
      </section>

      <section
        className="site-max"
        style={{ marginTop: "var(--section-gap)", maxWidth: "124rem", paddingBottom: "6rem" }}
      >
        <Link
          href={`/cases/${proximo.slug}`}
          className="group flex items-center justify-between border-t border-rule pt-[3.2rem]"
        >
          <span className="font-mono text-[1.2rem] uppercase tracking-[0.08em] text-muted">
            Próximo case
          </span>
          <span className="font-display font-semibold text-[clamp(2rem,3vw,3.2rem)] tracking-[-0.02em] group-hover:text-azul transition-colors">
            {proximo.cliente} →
          </span>
        </Link>
      </section>
    </>
  );
}
```

Note on scope: the spec described the 8 placeholder cases as a structurally simpler page. This implementation keeps a single `CaseBody` for every case — the conditional blocks (`resultados`, `depoimento`) already collapse away when the data is absent, producing the same visible result the spec asked for (narrative fallback text + CTA + next-case link, no results/testimonial sections) without duplicating a second component. This is a simplification within the approved design, not a scope change — flag it to the user in the final report.

- [ ] **Step 2: Verify with TypeScript**

```bash
npx tsc --noEmit --jsx preserve --esModuleInterop --target es2020 --module esnext --moduleResolution bundler --skipLibCheck components/sections/CaseBody.tsx
```

Expected: only `TS2307` path-alias errors, no other errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/CaseBody.tsx
git commit -m "Add CaseBody component with narrative, conditional results/testimonial, and next-case nav"
```

---

## Task 3: The `/cases/[slug]` route, wired and verified live

**Files:**
- Create: `app/cases/[slug]/page.tsx`

**Interfaces:**
- Consumes: `CaseHero` (Task 1), `CaseBody` (Task 2), `cases` and `site` from `lib/content.ts`, `Header` from `components/sections/Header.tsx`, `Footer` from `components/sections/Footer.tsx`.

- [ ] **Step 1: Write the route**

Create `app/cases/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cases, site } from "@/lib/content";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import CaseHero from "@/components/sections/CaseHero";
import CaseBody from "@/components/sections/CaseBody";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caso = cases.find((c) => c.slug === slug);
  if (!caso) return {};

  const temConteudoReal = "foto" in caso && !!caso.foto;

  return {
    title: `${caso.cliente} — Case ${site.nome}`,
    description:
      "resumo" in caso && caso.resumo
        ? caso.resumo
        : `Case de ${caso.servico} da ${caso.cliente}, por ${site.nome}.`,
    robots: temConteudoReal ? undefined : { index: false, follow: true },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = cases.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();

  const caso = cases[index];
  const proximo = cases[(index + 1) % cases.length];

  return (
    <>
      <Header />
      <main>
        <CaseHero caso={caso} />
        <CaseBody caso={caso} proximo={proximo} />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify with TypeScript**

```bash
cd "G:/Meu Drive/Novo Site Beeon/Novo-site-Beeon" && npx tsc --noEmit
```

Run this one WITHOUT the standalone flags (uses the project's real `tsconfig.json`, so path aliases resolve correctly this time) — expect zero errors across the whole project, not just this file.

- [ ] **Step 3: Verify live in the browser**

- Check whether the dev server (`beeon-dev` preview config) is already running; start it if not.
- Navigate to `http://localhost:3000/cases/atelie-materno` (a real case). Confirm: the hero shows the real photo with the gradient and the info box (client name + service badge) anchored at the bottom, the "Sobre o projeto" section shows the real `resumo` text, no Resultados or Depoimento section appears (no data yet — expected), the CTA links to `/#diagnostico`, and "Próximo case" links to the next case in the array (`expresso-nepomuceno`) — click it and confirm it navigates correctly.
- Navigate to `http://localhost:3000/cases/duda-imoveis` (a placeholder case, no photo). Confirm: the hero shows the brand-striped `MediaPlaceholder` instead of a broken image, the body shows "Este case está em produção...", and the CTA + next-case link still work.
- View source or inspect the rendered `<head>` for `/cases/duda-imoveis` and confirm a `<meta name="robots" content="noindex, follow">` tag is present; confirm it's absent on `/cases/atelie-materno`.
- Navigate to `http://localhost:3000/cases/nao-existe` and confirm Next.js renders its standard 404 page, not a crash.
- Go back to `http://localhost:3000` and click a case card in the home page's Cases section — confirm it now lands on a working page instead of a 404.
- If any console errors, TypeScript errors, or visual bugs turn up, read the relevant source and fix before committing.

- [ ] **Step 4: Commit**

```bash
git add "app/cases/[slug]/page.tsx"
git commit -m "Add /cases/[slug] route, fixing the case links that 404'd site-wide"
```

---

## Self-Review Notes

- **Spec coverage:** hero with photo+bottom-box for real cases (Task 1), placeholder hero for the other 8 (Task 1), narrative body from existing `resumo` with no invention (Task 2), conditional results/testimonial sections that stay hidden until real data exists (Task 2), CTA to `/#diagnostico` (Task 2), next-case navigation (Task 2), `generateStaticParams` for all 11 slugs, `notFound()` for unknown slugs, `noindex` for the 8 thin-content cases (Task 3). All spec sections have a task.
- **Placeholder scan:** no TBD/invented data. The only "placeholder" is the intentional, spec-approved fallback UI text for cases without real content yet — not a deferred engineering task.
- **Type consistency:** `CaseItem = (typeof cases)[number]` defined identically (not re-declared differently) in both `CaseHero.tsx` and `CaseBody.tsx`. `CaseBody`'s `proximo` prop type matches what `page.tsx` computes (`cases[(index + 1) % cases.length]`, same `CaseItem` type). Field names read from `caso` (`foto`, `resumo`, `resultados`, `depoimento`, `cliente`, `servico`, `slug`) match `lib/content.ts`'s existing `cases` shape exactly — verified against the file, not assumed.
- **Deviation from spec noted:** Task 2 uses one `CaseBody` component for both real and placeholder cases instead of two separate structures — same visible output, less duplication. Documented inline in Task 2.
