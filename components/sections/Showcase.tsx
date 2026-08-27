"use client";

import { useState } from "react";
import { servicos } from "@/lib/content";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

/**
 * Vitrine de serviços: hover/foco troca o vídeo e o resumo ao lado.
 * Animação especificada com referência ao After Effects: o vídeo que
 * entra só sobe em Y (sem fade, sem opacidade) — sobe de baixo do
 * quadro até a posição final. O vídeo que acabou de sair não
 * desaparece: só encolhe (scale), anchor point centralizado embaixo,
 * diminuindo de tamanho enquanto o novo sobe por cima dele. Só o
 * ativo e o anterior-imediato participam disso — os outros dois
 * ficam sempre estacionados embaixo (translateY 100%), prontos pra
 * subir na próxima vez que forem escolhidos, então a subida acontece
 * toda vez, não só na primeira.
 */
export default function Showcase() {
  const [active, setActive] = useState(0);
  const [anterior, setAnterior] = useState<number | null>(null);

  function ativar(i: number) {
    if (i === active) return;
    setAnterior(active);
    setActive(i);
  }

  return (
    <section id="servicos" className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
      <div className="site-grid items-start">
        {/* vídeo — entra subindo em Y, o anterior só encolhe */}
        <div className="col-span-12 lg:col-span-5 order-2 lg:order-1 mt-[4rem] lg:mt-0">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1rem] bg-ground">
            {servicos.map((s, i) => {
              const ehAtivo = i === active;
              const ehAnterior = i === anterior;
              return (
                <div
                  key={s.slug}
                  className="absolute inset-0"
                  style={{
                    transform: `translateY(${ehAtivo || ehAnterior ? "0" : "100%"}) scale(${
                      ehAtivo ? 1 : 0.86
                    })`,
                    transformOrigin: "50% 100%",
                    zIndex: ehAtivo ? 2 : ehAnterior ? 1 : 0,
                    transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <video
                    className="h-full w-full object-cover"
                    src={s.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  />
                </div>
              );
            })}
          </div>

          <div className="relative mt-[1.6rem] min-h-[3.6rem]">
            {servicos.map((s, i) => (
              <p
                key={s.slug}
                className="absolute inset-0 font-mono text-[1.2rem] text-muted"
                style={{
                  opacity: active === i ? 1 : 0,
                  transition: "opacity 0.4s ease",
                }}
              >
                {s.resumo}
              </p>
            ))}
          </div>
        </div>

        {/* nomes empilhados */}
        <div className="col-span-12 lg:col-span-7 order-1 lg:order-2">
          <ul>
            {servicos.map((s, i) => (
              <RevealOnScroll key={s.slug} as="li" y={4.4} duration={0.9} delay={i * 0.12}>
                <a
                  href={`/servicos/${s.slug}`}
                  onMouseEnter={() => ativar(i)}
                  onFocus={() => ativar(i)}
                  className={`block font-display font-semibold text-[clamp(3.6rem,6.2vw,7.2rem)] leading-[1.05] tracking-[-0.025em] transition-colors duration-500 ${
                    active === i ? "text-ink" : "text-rule"
                  }`}
                >
                  {s.nome}
                </a>
              </RevealOnScroll>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
