"use client";

import { useState } from "react";
import { servicos } from "@/lib/content";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

/**
 * Vitrine de serviços: puramente controlada por hover/foco. Ao passar
 * o mouse num serviço, ele fica preto (os outros cinza) e o vídeo ao
 * lado troca para o reel daquele serviço, com crossfade + leve subida.
 */
export default function Showcase() {
  const [active, setActive] = useState(0);
  const servico = servicos[active];

  return (
    <section id="servicos" className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
      <div className="site-grid items-start">
        {/* vídeo com crossfade */}
        <div className="col-span-12 lg:col-span-5 order-2 lg:order-1 mt-[4rem] lg:mt-0">
          <div key={servico.slug} className="showcase-rise">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1rem] bg-ink">
              <video
                key={servico.video}
                className="h-full w-full object-cover"
                src={servico.video}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            </div>
          </div>
          <p className="mt-[1.6rem] font-mono text-[1.2rem] text-muted">
            {servico.resumo}
          </p>
        </div>

        {/* nomes empilhados */}
        <div className="col-span-12 lg:col-span-7 order-1 lg:order-2">
          <ul>
            {servicos.map((s, i) => (
              <RevealOnScroll key={s.slug} as="li" y={4.4} duration={0.9} delay={i * 0.12}>
                <a
                  href={`/servicos/${s.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
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

      <style>{`
        .showcase-rise {
          animation: showcase-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes showcase-rise {
          from { opacity: 0; transform: translateY(3.2rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .showcase-rise { animation: none; }
        }
      `}</style>
    </section>
  );
}
