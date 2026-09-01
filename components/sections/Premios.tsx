"use client";

import { useEffect, useState } from "react";
import { premios } from "@/lib/content";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

const itens = [
  { titulo: premios.destaque.titulo, desc: premios.destaque.desc, tamanho: "1.7rem" },
  { titulo: premios.cards[0].valor, desc: premios.cards[0].desc, tamanho: "2.4rem" },
  { titulo: premios.cards[1].valor, desc: premios.cards[1].desc, tamanho: "2.4rem" },
  { titulo: premios.cards[2].valor, desc: premios.cards[2].desc, tamanho: "2.4rem" },
];

export default function Premios() {
  const [ativo, setAtivo] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAtivo((v) => (v + 1) % itens.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="premios" className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
      <div className="site-grid items-center gap-y-[4rem]">
        <RevealOnScroll className="col-span-12 lg:col-span-6">
          <p className="font-mono text-[1.2rem] uppercase tracking-[0.08em] text-azul mb-[1.6rem]">
            {premios.eyebrow}
          </p>
          <h2 className="font-display font-semibold text-[clamp(2rem,2.6vw,2.8rem)] leading-[1.3] tracking-[-0.01em] max-w-[42rem]">
            {premios.titulo}
          </h2>
        </RevealOnScroll>

        <RevealOnScroll className="col-span-12 lg:col-span-6" delay={0.12}>
          <div className="relative mx-auto" style={{ width: "min(100%, 38rem)", height: "34rem" }}>
            {itens.map((item, i) => {
              const posicaoNaPilha = (i - ativo + itens.length) % itens.length;
              const ativoAtual = posicaoNaPilha === 0;

              return (
                <div
                  key={item.titulo}
                  className="absolute inset-0 rounded-[1.6rem] border border-rule flex items-center justify-center text-center overflow-hidden"
                  style={{
                    background: ativoAtual ? "var(--paper)" : "var(--ground)",
                    padding: "2.4rem",
                    zIndex: itens.length - posicaoNaPilha,
                    transform: `translate(${posicaoNaPilha * 1.6}rem, ${posicaoNaPilha * 1.6}rem) scale(${1 - posicaoNaPilha * 0.055})`,
                    boxShadow: ativoAtual
                      ? "0 1.8rem 3.6rem rgba(10,10,10,.16)"
                      : "0 0.6rem 1.6rem rgba(10,10,10,.08)",
                    opacity: posicaoNaPilha < 3 ? 1 : 0,
                    transition:
                      "transform 0.7s cubic-bezier(0.16,1,0.3,1), box-shadow 0.7s ease, background 0.7s ease, opacity 0.7s ease",
                  }}
                >
                  <div>
                    <span
                      className="font-display font-extrabold text-ink block"
                      style={{ fontSize: item.tamanho, lineHeight: 1.1 }}
                    >
                      {item.titulo}
                    </span>
                    <p
                      className="font-mono text-[0.92rem] text-muted mt-[1rem] mx-auto leading-[1.5]"
                      style={{ maxWidth: "22rem" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
