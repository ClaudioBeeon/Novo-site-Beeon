"use client";

import { useState } from "react";
import { servicos } from "@/lib/content";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

/**
 * Vitrine de serviços: hover/foco troca o vídeo e o resumo ao lado.
 * Crossfade simples (opacidade + leve subida) — nada de escala nem
 * clip-path. Confirmado via captura de vídeo frame a frame que o
 * próprio vucko.co mostra um instante sólido do fundo do contêiner
 * durante a troca; a diferença é que os vídeos deles têm fundo escuro
 * e o nosso é bem colorido, então qualquer técnica de revelação deixa
 * uma emenda visível por contraste — a saída mais confiável é manter
 * a transição rápida (0.4s) para minimizar essa janela, sem tentar
 * geometria complexa que só trocava um problema por outro.
 */
export default function Showcase() {
  const [active, setActive] = useState(0);

  return (
    <section id="servicos" className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
      <div className="site-grid items-start">
        {/* vídeo — crossfade rápido com leve subida */}
        <div className="col-span-12 lg:col-span-5 order-2 lg:order-1 mt-[4rem] lg:mt-0">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1rem] bg-ink">
            {servicos.map((s, i) => (
              <div
                key={s.slug}
                className="absolute inset-0"
                style={{
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? "translateY(0)" : "translateY(1.2rem)",
                  zIndex: active === i ? 1 : 0,
                  transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
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
            ))}
          </div>

          <div className="relative mt-[1.6rem] min-h-[2.4rem]">
            {servicos.map((s, i) => (
              <p
                key={s.slug}
                className="font-mono text-[1.2rem] text-muted"
                style={{
                  position: active === i ? "static" : "absolute",
                  inset: active === i ? undefined : 0,
                  opacity: active === i ? 1 : 0,
                  transition: "opacity 0.4s ease",
                  pointerEvents: active === i ? "auto" : "none",
                }}
              >
                {s.resumo}
              </p>
            ))}
          </div>
        </div>

        {/* nomes empilhados — opacidade em vez de cor, igual ao vucko */}
        <div className="col-span-12 lg:col-span-7 order-1 lg:order-2">
          <ul>
            {servicos.map((s, i) => (
              <RevealOnScroll key={s.slug} as="li" y={4.4} duration={0.9} delay={i * 0.12}>
                <a
                  href={`/servicos/${s.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="block font-display font-semibold text-[clamp(3.6rem,6.2vw,7.2rem)] leading-[1.05] tracking-[-0.025em] text-ink transition-opacity duration-300"
                  style={{ opacity: active === i ? 1 : 0.3 }}
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
