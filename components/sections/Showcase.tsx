"use client";

import { useRef, useState } from "react";
import { servicos } from "@/lib/content";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

/**
 * Vitrine de serviços: hover/foco troca o vídeo e o resumo ao lado.
 * Animação especificada com referência ao After Effects: o vídeo que
 * entra só sobe em Y (sem fade, sem opacidade) — ele sobe de baixo do
 * quadro até a posição final. O vídeo que sai não desaparece: ele só
 * encolhe (scale), com o anchor point centralizado e embaixo, então
 * diminui de tamanho ancorado na base enquanto o novo sobe por cima
 * dele. Cada vídeo, uma vez revelado, nunca mais desce — fica em pé
 * (translateY 0) pra sempre; só alterna entre scale(1) quando ativo e
 * scale(0.86) quando não é mais o ativo.
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
        {/* vídeo — entra subindo em Y, o anterior só encolhe */}
        <div className="col-span-12 lg:col-span-5 order-2 lg:order-1 mt-[4rem] lg:mt-0">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1rem] bg-ink">
            {servicos.map((s, i) => (
              <div
                key={s.slug}
                className="absolute inset-0"
                style={{
                  transform: `translateY(${mostrados[i] ? "0" : "100%"}) scale(${active === i ? 1 : 0.86})`,
                  transformOrigin: "50% 100%",
                  zIndex: zIndices[i],
                  transition:
                    "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
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
