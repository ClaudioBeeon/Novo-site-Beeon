"use client";

import { useState } from "react";
import Image from "next/image";
import { cases, servicos } from "@/lib/content";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

const VISIBLE = 3;

function resumoFor(servico: string) {
  return servicos.find((s) => s.nome === servico)?.resumo ?? servico;
}

export default function Cases() {
  const [start, setStart] = useState(0);
  const destaques = cases.filter((c) => "foto" in c && c.foto);
  const total = destaques.length;
  const showNav = total > VISIBLE;

  const visible = Array.from({ length: VISIBLE }, (_, i) => destaques[(start + i) % total]);

  const next = () => setStart((s) => (s + 1) % total);
  const prev = () => setStart((s) => (s - 1 + total) % total);

  return (
    <section id="cases" className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
      <div className="mb-[7rem] flex items-end justify-between gap-[2rem]">
        <RevealOnScroll>
          <h2 className="font-display font-semibold text-[clamp(2.4rem,3.2vw,3.4rem)] leading-[1.15] tracking-[-0.02em] text-balance max-w-[26ch]">
            <span className="text-azul">04 —</span> Resultado real, para clientes reais.
          </h2>
        </RevealOnScroll>

        {showNav && (
          <div className="hidden sm:flex items-center gap-[1rem] shrink-0">
            <button
              type="button"
              onClick={prev}
              aria-label="Case anterior"
              className="inline-flex h-[3.8rem] w-[3.8rem] items-center justify-center rounded-full border border-rule text-ink hover:border-azul hover:text-azul transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Próximo case"
              className="inline-flex h-[3.8rem] w-[3.8rem] items-center justify-center rounded-full bg-azul text-paper hover:bg-azul-dim transition-colors"
            >
              →
            </button>
          </div>
        )}
      </div>

      <RevealOnScroll className="grid grid-cols-1 sm:grid-cols-3 gap-[0.6rem]" y={3.2}>
        {visible.map((c, i) => (
          <a
            key={`${c.slug}-${start}`}
            href={`/cases/${c.slug}`}
            className="case-card-rise group relative block aspect-square w-full overflow-hidden rounded-[0.5rem]"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            {"foto" in c && c.foto ? (
              <>
                <Image
                  src={c.foto}
                  alt={c.cliente}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/25" />
                {i !== 1 && (
                  <div className="absolute inset-0 bg-azul mix-blend-color opacity-80" />
                )}
              </>
            ) : (
              <MediaPlaceholder kind="vídeo" label="" className="h-full w-full" />
            )}

            <div className="absolute inset-0 flex flex-col justify-between p-[1.8rem]">
              <span className="font-display font-semibold uppercase text-paper text-[clamp(1.5rem,1.6vw,1.8rem)] leading-[1.15] tracking-[-0.01em] text-balance">
                {c.cliente}
              </span>

              <div>
                <p className="font-mono text-[1.1rem] leading-[1.5] text-paper/85 mb-[1.2rem]">
                  {"resumo" in c && c.resumo ? c.resumo : resumoFor(c.servico)}
                </p>
                <span className="inline-block rounded-full bg-paper/20 backdrop-blur px-[1.1rem] py-[0.5rem] font-mono text-[0.98rem] text-paper">
                  {c.servico}
                </span>
              </div>
            </div>
          </a>
        ))}
      </RevealOnScroll>

      <div className="mt-[3.2rem] flex items-center justify-between">
        <a
          href="/cases"
          className="inline-flex items-center gap-[1rem] font-display font-semibold text-[2rem] tracking-[-0.01em] text-ink hover:text-azul transition-colors"
        >
          → Ver todos os cases
          <span className="font-mono text-[1.3rem] text-muted">({cases.length})</span>
        </a>

        {showNav && (
          <div className="flex sm:hidden items-center gap-[1rem]">
            <button
              type="button"
              onClick={prev}
              aria-label="Case anterior"
              className="inline-flex h-[4rem] w-[4rem] items-center justify-center rounded-full border border-rule text-ink"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Próximo case"
              className="inline-flex h-[4rem] w-[4rem] items-center justify-center rounded-full bg-azul text-paper"
            >
              →
            </button>
          </div>
        )}
      </div>

      <style>{`
        .case-card-rise {
          animation: case-card-rise 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
        }
        @keyframes case-card-rise {
          from { opacity: 0; transform: translateY(1rem) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .case-card-rise { animation: none; }
        }
      `}</style>
    </section>
  );
}
