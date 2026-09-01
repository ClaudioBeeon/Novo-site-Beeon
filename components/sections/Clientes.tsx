import { cases } from "@/lib/content";

const nomes = cases.map((c) => c.cliente);
const faixa = [...nomes, ...nomes];

export default function Clientes() {
  return (
    <section
      className="clientes-marquee-section w-full overflow-hidden border-y border-rule bg-paper"
      style={{ paddingBlock: "3.2rem" }}
      aria-label="Clientes atendidos pela Beeon"
    >
      <div className="clientes-marquee-track flex w-max items-center">
        {faixa.map((nome, i) => (
          <span
            key={`${nome}-${i}`}
            className="font-display font-semibold text-[clamp(1.6rem,2vw,2.2rem)] tracking-[-0.01em] text-muted shrink-0"
            style={{ paddingInline: "3.2rem" }}
          >
            {nome}
          </span>
        ))}
      </div>

      <style>{`
        .clientes-marquee-track {
          animation: clientes-marquee 32s linear infinite;
        }
        .clientes-marquee-section:hover .clientes-marquee-track {
          animation-play-state: paused;
        }
        @keyframes clientes-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .clientes-marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
