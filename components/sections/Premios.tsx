"use client";

import { useEffect, useState } from "react";
import { premios } from "@/lib/content";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

/**
 * Caminho de um hexágono regular (proporção 0.866:1) com cantos
 * arredondados, em coordenadas objectBoundingBox (0-1). Erro comum:
 * usar a largura inteira da caixa para os vértices do meio — um
 * hexágono regular é mais estreito que alto, por isso as margens
 * 0.067/0.933 em vez de 0/1.
 */
const HEX_PATH =
  "M 0.4307 0.04 Q 0.50 0 0.5693 0.04 L 0.8637 0.21 Q 0.933 0.25 0.933 0.33 L 0.933 0.67 Q 0.933 0.75 0.8637 0.79 L 0.5693 0.96 Q 0.50 1.00 0.4307 0.96 L 0.1363 0.79 Q 0.067 0.75 0.067 0.67 L 0.067 0.33 Q 0.067 0.25 0.1363 0.21 Z";

const itens = [
  { titulo: premios.destaque.titulo, desc: premios.destaque.desc, tamanho: "1.5rem" },
  { titulo: premios.cards[0].valor, desc: premios.cards[0].desc, tamanho: "1.9rem" },
  { titulo: premios.cards[1].valor, desc: premios.cards[1].desc, tamanho: "1.9rem" },
  { titulo: premios.cards[2].valor, desc: premios.cards[2].desc, tamanho: "1.9rem" },
];

const POSICOES = [
  { top: "0%", left: "0%" },
  { top: "0%", left: "55%" },
  { top: "55%", left: "0%" },
  { top: "55%", left: "55%" },
];

export default function Premios() {
  const [ativo, setAtivo] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAtivo((v) => (v + 1) % itens.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="premios" className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <clipPath id="hexround" clipPathUnits="objectBoundingBox">
            <path d={HEX_PATH} />
          </clipPath>
        </defs>
      </svg>

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
          <div className="relative mx-auto" style={{ width: "min(100%, 40rem)", aspectRatio: "1 / 1" }}>
            {itens.map((item, i) => {
              const ativoAtual = ativo === i;
              return (
                <div
                  key={item.titulo}
                  className="absolute"
                  style={{
                    // Cresce mudando width/height de verdade, nunca transform:
                    // clip-path + transform (mesmo em elemento separado, se
                    // um ancestral tem transform) é instável em vários
                    // navegadores — já vi isso quebrar de duas formas
                    // diferentes (virar quadrado, depois ficar invisível).
                    // width/height são propriedades de layout normais, sem
                    // esse problema.
                    width: ativoAtual ? "44%" : "38%",
                    aspectRatio: "1 / 1",
                    top: ativoAtual ? `calc(${POSICOES[i].top} - 3%)` : POSICOES[i].top,
                    left: ativoAtual ? `calc(${POSICOES[i].left} - 3%)` : POSICOES[i].left,
                    zIndex: ativoAtual ? 2 : 1,
                    transition: "width 0.7s cubic-bezier(0.16,1,0.3,1), top 0.7s cubic-bezier(0.16,1,0.3,1), left 0.7s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {/* camada separada: essa cuida só do recorte hexagonal. */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "url(#hexround)",
                      boxShadow: ativoAtual ? "0 1.8rem 3.6rem rgba(10,10,10,.16)" : "none",
                      transition: "box-shadow 0.7s ease",
                    }}
                  >
                    <div className="absolute inset-0" style={{ background: "var(--ground)" }} />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "var(--paper)",
                        opacity: ativoAtual ? 1 : 0,
                        transition: "opacity 0.7s ease",
                      }}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center text-center"
                      style={{ padding: "1.6rem" }}
                    >
                      <div>
                        <span
                          className="font-display font-extrabold text-ink block"
                          style={{ fontSize: item.tamanho, lineHeight: 1.1 }}
                        >
                          {item.titulo}
                        </span>
                        <p
                          className="font-mono text-[0.78rem] text-muted mt-[0.7rem] mx-auto leading-[1.4]"
                          style={{ maxWidth: "11.5rem" }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
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
