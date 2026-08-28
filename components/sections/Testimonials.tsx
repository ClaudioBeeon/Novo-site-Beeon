"use client";

import { useState } from "react";
import { depoimentos } from "@/lib/content";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

const AVATAR_COLORS = ["#0000FB", "#FFC400", "#2B2BFC", "#FFDB66"];

function initials(nome: string) {
  return nome.split(" ").map((w) => w[0]).slice(0, 2).join("");
}

export default function Testimonials() {
  const [i, setI] = useState(0);
  const d = depoimentos[i];
  const bg = AVATAR_COLORS[i % AVATAR_COLORS.length];
  const fg = bg === "#FFC400" || bg === "#FFDB66" ? "#0a0a0a" : "#ffffff";

  return (
    <section className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
      <RevealOnScroll>
        <div className="rounded-[1.4rem] border border-rule bg-paper grid grid-cols-1 md:grid-cols-[18rem_1fr] gap-[2.8rem] p-[2.8rem] md:p-[3.6rem]">
          {/* coluna esquerda */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-mono text-[1.1rem] tracking-[0.08em] text-muted mb-[1rem]">
                06 — O que dizem os clientes
              </p>
              <p className="font-mono text-[1.2rem] leading-[1.5] text-muted max-w-[20rem]">
                Agências que a gente indica de olhos fechados.
              </p>
            </div>
            <div className="flex gap-[0.8rem] mt-[2.4rem]">
              <div className="w-[4.6rem] h-[4.6rem] rounded-[0.8rem] bg-ink text-paper flex flex-col items-center justify-center text-center font-mono text-[0.68rem] leading-[1.25] p-[0.4rem]">
                <span className="text-sinal text-[1.1rem] mb-[0.1rem]">⬡</span>
                Limitless
                <br />
                RD Station
              </div>
              <div className="w-[4.6rem] h-[4.6rem] rounded-[0.8rem] bg-ink text-paper flex flex-col items-center justify-center text-center font-mono text-[0.68rem] leading-[1.25] p-[0.4rem]">
                <span className="text-sinal text-[1.1rem] mb-[0.1rem]">+6M</span>
                impactadas
                <br />
                por mês
              </div>
            </div>
          </div>

          {/* coluna direita */}
          <div className="flex flex-col">
            <div className="font-display font-extrabold text-[3.6rem] leading-none text-ink -mb-[0.2rem] -ml-[0.2rem]">
              &ldquo;
            </div>
            <blockquote className="font-display font-medium text-[clamp(1.5rem,1.7vw,1.8rem)] leading-[1.4] tracking-[-0.005em] text-ink text-balance flex-1">
              {d.texto}
            </blockquote>
            <hr className="border-t border-rule my-[2rem]" />
            <div className="flex items-center justify-between gap-[1.6rem] flex-wrap">
              <div className="flex items-center gap-[1.2rem]">
                <div
                  className="w-[4rem] h-[4rem] rounded-full flex items-center justify-center font-display font-bold text-[1.2rem] shrink-0"
                  style={{ background: bg, color: fg }}
                >
                  {initials(d.nome)}
                </div>
                <div>
                  <b className="block font-display font-bold text-[1.3rem] tracking-[-0.005em]">
                    {d.nome}
                  </b>
                  <span className="font-mono text-[1.05rem] text-muted">{d.cargo}</span>
                </div>
              </div>
              <div className="flex items-center gap-[1.2rem]">
                <button
                  type="button"
                  onClick={() => setI((v) => Math.max(0, v - 1))}
                  aria-label="Depoimento anterior"
                  className={`text-[1.6rem] transition-colors ${
                    i > 0 ? "text-ink hover:text-azul" : "text-rule"
                  }`}
                >
                  ←
                </button>
                <span className="font-mono text-[1.05rem] text-muted tabular-nums">
                  {String(i + 1).padStart(2, "0")} / {String(depoimentos.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => setI((v) => Math.min(depoimentos.length - 1, v + 1))}
                  aria-label="Próximo depoimento"
                  className={`text-[1.6rem] transition-colors ${
                    i < depoimentos.length - 1 ? "text-ink hover:text-azul" : "text-rule"
                  }`}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
