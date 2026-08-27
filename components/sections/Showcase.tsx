"use client";

import { useRef, useState } from "react";
import { servicos } from "@/lib/content";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

/**
 * Vitrine de serviços: hover/foco troca o vídeo e o resumo ao lado.
 * Cada vídeo fica sempre montado (nada de remontar, então o playback
 * não reinicia). Um vídeo, uma vez mostrado, nunca mais encolhe de
 * volta — ele fica cobrindo o quadro inteiro pra sempre, e o próximo
 * cresce por cima dele (scaleY a partir da base, empilhado por
 * z-index de "mais recente por cima"). Assim sempre existe vídeo
 * embaixo cobrindo 100% do quadro durante a transição, nunca o fundo
 * escuro do contêiner — dois vídeos encolhendo/crescendo ao mesmo
 * tempo a partir do mesmo ponto nunca "se encontram" no meio, o que
 * deixava uma fresta visível.
 */
export default function Showcase() {
  const [active, setActive] = useState(0);
  const [mostrados, setMostrados] = useState(() => servicos.map((_, i) => i === 0));
  const [zIndices, setZIndices] = useState(() => servicos.map((_, i) => (i === 0 ? 1 : 0)));
  const zTopo = useRef(1);

  function ativar(i: number) {
    setActive(i);
    setMostrados((prev) => (prev[i] ? prev : prev.map((v, idx) => (idx === i ? true : v))));
    zTopo.current += 1;
    const novoZ = zTopo.current;
    setZIndices((prev) => prev.map((v, idx) => (idx === i ? novoZ : v)));
  }

  return (
    <section id="servicos" className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
      <div className="site-grid items-start">
        {/* vídeo — cresce de baixo pra cima ao trocar */}
        <div className="col-span-12 lg:col-span-5 order-2 lg:order-1 mt-[4rem] lg:mt-0">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1rem] bg-ink">
            {servicos.map((s, i) => (
              <div
                key={s.slug}
                className="absolute inset-0 origin-bottom"
                style={{
                  transform: mostrados[i] ? "scaleY(1)" : "scaleY(0)",
                  opacity: mostrados[i] ? 1 : 0,
                  zIndex: zIndices[i],
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
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
                  onMouseEnter={() => ativar(i)}
                  onFocus={() => ativar(i)}
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
