import Image from "next/image";
import Link from "next/link";
import { cases } from "@/lib/content";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

type CaseItem = (typeof cases)[number];

/**
 * Proporção das duas colunas por linha do mosaico, alternando qual lado é
 * maior — o mesmo espírito assimétrico do "Our Portfolio" do awsmd.com,
 * medido diretamente no site deles via Playwright.
 */
const RATIOS: [number, number][] = [
  [58, 42],
  [42, 58],
  [62, 38],
];

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: "rotate(-45deg)" }} aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CaseCard({ caso }: { caso: CaseItem }) {
  const temFoto = "foto" in caso && !!caso.foto;

  return (
    <Link
      href={`/cases/${caso.slug}`}
      className="group relative block h-[26rem] sm:h-[32rem] w-full overflow-hidden rounded-[1.6rem]"
    >
      {temFoto ? (
        <Image
          src={caso.foto}
          alt={caso.cliente}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
      ) : (
        <MediaPlaceholder kind="foto" label={caso.cliente} className="h-full w-full" />
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] opacity-0 transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: "var(--azul)", filter: "blur(4rem)" }}
      />

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-[1.2rem] bg-paper px-[1.8rem] py-[1.5rem]">
        <span className="font-display font-semibold text-[1.4rem] tracking-[-0.01em] text-ink truncate">
          {caso.cliente}
        </span>
        <span className="inline-flex h-[3.6rem] w-[3.6rem] shrink-0 items-center justify-center rounded-full bg-ground text-ink transition-transform duration-300 group-hover:rotate-45">
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}

export default function Cases() {
  const linhas: CaseItem[][] = [];
  for (let i = 0; i < cases.length; i += 2) {
    linhas.push(cases.slice(i, i + 2));
  }

  return (
    <section id="cases" className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
      <RevealOnScroll className="mb-[5rem] block">
        <h2 className="font-display font-semibold text-[clamp(2.4rem,3.2vw,3.4rem)] leading-[1.15] tracking-[-0.02em] text-balance max-w-[26ch]">
          <span className="text-azul">03 —</span> Resultado real, para clientes reais.
        </h2>
      </RevealOnScroll>

      <div className="flex flex-col gap-[0.8rem]">
        {linhas.map((linha, i) => {
          const doisCards = linha.length === 2;
          const [a, b] = RATIOS[i % RATIOS.length];

          return (
            <RevealOnScroll key={linha.map((c) => c.slug).join("-")} y={2.4} delay={i * 0.06} className="block">
              <div
                className={`grid grid-cols-1 gap-[0.8rem] ${
                  doisCards ? "sm:[grid-template-columns:var(--a)_var(--b)]" : ""
                }`}
                style={doisCards ? ({ "--a": `${a}fr`, "--b": `${b}fr` } as React.CSSProperties) : undefined}
              >
                {linha.map((caso) => (
                  <CaseCard key={caso.slug} caso={caso} />
                ))}
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}
