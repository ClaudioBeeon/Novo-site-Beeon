import { numeros } from "@/lib/content";
import Counter from "@/components/motion/Counter";

export default function Stats() {
  return (
    <section
      className="bg-ink text-paper"
      style={{ marginTop: "var(--section-gap)", paddingBlock: "8rem" }}
    >
      <div className="site-max" style={{ maxWidth: "124rem" }}>
        <p className="font-mono text-[1.2rem] tracking-[0.1em] text-sinal uppercase mb-[4rem]">
          02 — Resultado em números
        </p>

        <div className="site-grid gap-y-[4rem]">
          {numeros.map((n) => (
            <div key={n.label} className="col-span-12 sm:col-span-4">
              <Counter
                value={n.valor}
                prefixo={n.prefixo}
                sufixo={n.sufixo}
                className="block font-display font-semibold text-[clamp(4rem,6vw,7rem)] leading-none tracking-[-0.02em]"
              />
              <p className="mt-[1.2rem] font-mono text-[1.2rem] text-white/60 uppercase tracking-[0.04em]">
                {n.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
