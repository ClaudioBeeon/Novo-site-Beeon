import { blog } from "@/lib/content";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

/**
 * Direção editorial pra página /blog: 1 post em destaque em tipografia
 * grande + o resto como lista tipográfica, sem foto nem carrossel. Mora
 * numa página própria — não é o preview da home.
 */
export default function BlogEditorial() {
  const [destaque, ...resto] = blog;

  return (
    <section className="relative overflow-hidden bg-ink text-paper" style={{ paddingTop: "9rem", paddingBottom: "10rem" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[14rem] -left-[8rem] h-[34rem] w-[34rem] rounded-full opacity-35"
        style={{ background: "radial-gradient(circle, var(--azul) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[4rem] left-[20rem] h-[24rem] w-[24rem] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, var(--azul-dim) 0%, transparent 70%)" }}
      />

      <div className="site-max relative" style={{ maxWidth: "124rem" }}>
        <div className="mb-[5.5rem] flex flex-wrap items-end justify-between gap-[2rem]">
          <RevealOnScroll>
            <p className="font-mono text-[1.05rem] tracking-[0.1em] text-sinal uppercase mb-[1rem]">Blog</p>
            <h1 className="font-display font-semibold text-[clamp(2.6rem,4vw,4rem)] leading-[1.05] tracking-[-0.02em]">
              Ideias que a gente coloca em prática.
            </h1>
          </RevealOnScroll>

          <div className="flex gap-[0.7rem] flex-wrap">
            <span className="font-mono text-[0.92rem] px-[1.3rem] py-[0.6rem] rounded-full border border-sinal text-sinal">
              Todos
            </span>
            <span className="font-mono text-[0.92rem] px-[1.3rem] py-[0.6rem] rounded-full border border-white/16 text-paper/70">
              Marketing Digital
            </span>
            <span className="font-mono text-[0.92rem] px-[1.3rem] py-[0.6rem] rounded-full border border-white/16 text-paper/70">
              SEO
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-[4rem] lg:gap-[6rem] items-start">
          <RevealOnScroll y={3.2}>
            <a href={destaque.href} className="group block">
              <p className="font-mono text-[1.05rem] uppercase tracking-[0.06em] text-sinal mb-[1.6rem]">
                {destaque.categoria} <span className="text-paper/40 normal-case">· {destaque.data}</span>
              </p>
              <h2 className="font-display font-extrabold text-[clamp(2.6rem,5vw,5rem)] leading-[0.98] tracking-[-0.03em] text-balance mb-[2.2rem] group-hover:text-sinal transition-colors">
                {destaque.titulo}
              </h2>
              <p className="font-mono text-[1.25rem] leading-[1.6] text-paper/55 max-w-[44rem] mb-[2rem]">
                {destaque.resumo}
              </p>
              <span className="inline-flex items-center gap-[0.7rem] font-mono text-[1.1rem] text-paper border-b border-white/16 pb-[0.3rem] group-hover:text-sinal group-hover:border-sinal group-hover:gap-[1.1rem] transition-all">
                Ler artigo →
              </span>
            </a>
          </RevealOnScroll>

          <RevealOnScroll y={3.2} delay={0.12} className="flex flex-col">
            {resto.map((post) => (
              <a
                key={post.titulo}
                href={post.href}
                className="group block py-[1.8rem] border-t border-white/16 last:border-b last:border-white/16"
              >
                <p className="font-mono text-[0.88rem] uppercase tracking-[0.05em] text-paper/45 mb-[0.6rem]">
                  <b className="text-sinal font-medium not-italic">{post.categoria}</b> · {post.data}
                </p>
                <h3 className="font-display font-semibold text-[clamp(1.3rem,1.8vw,1.7rem)] leading-[1.28] tracking-[-0.01em] group-hover:text-sinal transition-colors">
                  {post.titulo}
                </h3>
              </a>
            ))}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
