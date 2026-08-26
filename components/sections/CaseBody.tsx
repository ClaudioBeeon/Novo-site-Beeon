import Link from "next/link";
import { cases } from "@/lib/content";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

type CaseItem = (typeof cases)[number];

const AVATAR_COR = "#0000FB";

function iniciais(nome: string) {
  return nome.split(" ").map((w) => w[0]).slice(0, 2).join("");
}

export default function CaseBody({ caso, proximo }: { caso: CaseItem; proximo: CaseItem }) {
  return (
    <>
      <section className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
        <div className="site-grid">
          <RevealOnScroll className="col-span-12 lg:col-span-8">
            <h2 className="font-display font-semibold text-[clamp(2rem,2.6vw,2.6rem)] leading-[1.15] tracking-[-0.02em] mb-[1.6rem]">
              Sobre o projeto
            </h2>
            {"resumo" in caso && caso.resumo ? (
              <p className="font-mono text-[1.4rem] leading-[1.6] text-muted max-w-[62rem]">
                {caso.resumo}
              </p>
            ) : (
              <p className="font-mono text-[1.4rem] leading-[1.6] text-muted max-w-[62rem]">
                Este case está em produção — em breve, o resultado completo por aqui.
              </p>
            )}
          </RevealOnScroll>
        </div>
      </section>

      {"resultados" in caso && caso.resultados && caso.resultados.length > 0 && (
        <section className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
          <RevealOnScroll className="site-grid gap-y-[3.2rem]" y={2.4}>
            {caso.resultados.map((r) => (
              <div key={r.label} className="col-span-6 sm:col-span-4">
                <span className="block font-display font-semibold text-[clamp(3.2rem,4.4vw,4.8rem)] leading-none tracking-[-0.02em]">
                  {r.valor}
                </span>
                <p className="mt-[1rem] font-mono text-[1.1rem] text-muted uppercase tracking-[0.04em]">
                  {r.label}
                </p>
              </div>
            ))}
          </RevealOnScroll>
        </section>
      )}

      {"depoimento" in caso && caso.depoimento && (
        <section className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
          <RevealOnScroll className="rounded-[1.4rem] border border-rule bg-paper p-[2.8rem] md:p-[3.6rem]">
            <div className="font-display font-extrabold text-[3.6rem] leading-none text-ink -mb-[0.2rem] -ml-[0.2rem]">
              &ldquo;
            </div>
            <blockquote className="font-display font-medium text-[clamp(1.5rem,1.7vw,1.8rem)] leading-[1.4] tracking-[-0.005em] text-ink text-balance max-w-[62rem]">
              {caso.depoimento.texto}
            </blockquote>
            <div className="flex items-center gap-[1.2rem] mt-[2.4rem]">
              <div
                className="w-[4rem] h-[4rem] rounded-full flex items-center justify-center font-display font-bold text-[1.2rem] shrink-0 text-paper"
                style={{ background: AVATAR_COR }}
              >
                {iniciais(caso.depoimento.nome)}
              </div>
              <div>
                <b className="block font-display font-bold text-[1.3rem] tracking-[-0.005em]">
                  {caso.depoimento.nome}
                </b>
                <span className="font-mono text-[1.05rem] text-muted">{caso.depoimento.cargo}</span>
              </div>
            </div>
          </RevealOnScroll>
        </section>
      )}

      <section className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
        <RevealOnScroll className="rounded-[1.4rem] bg-ink text-paper p-[3.2rem] sm:p-[4.4rem] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[2rem]">
          <h2 className="font-display font-semibold text-[clamp(2.4rem,3.4vw,3.6rem)] leading-[1.1] tracking-[-0.02em] max-w-[36rem] text-balance">
            Quer um resultado assim para o seu negócio?
          </h2>
          <Link
            href="/#diagnostico"
            className="inline-flex w-fit items-center rounded-full bg-paper px-[2.4rem] py-[1.3rem] font-display font-bold text-[1.1rem] text-ink hover:bg-sinal transition-colors"
          >
            Quero meu diagnóstico →
          </Link>
        </RevealOnScroll>
      </section>

      <section
        className="site-max"
        style={{ marginTop: "var(--section-gap)", maxWidth: "124rem", paddingBottom: "6rem" }}
      >
        <Link
          href={`/cases/${proximo.slug}`}
          className="group flex items-center justify-between border-t border-rule pt-[3.2rem]"
        >
          <span className="font-mono text-[1.2rem] uppercase tracking-[0.08em] text-muted">
            Próximo case
          </span>
          <span className="font-display font-semibold text-[clamp(2rem,3vw,3.2rem)] tracking-[-0.02em] group-hover:text-azul transition-colors">
            {proximo.cliente} →
          </span>
        </Link>
      </section>
    </>
  );
}
