import Image from "next/image";
import Link from "next/link";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import { cases } from "@/lib/content";

type CaseItem = (typeof cases)[number];

export default function CaseHero({ caso }: { caso: CaseItem }) {
  const temFoto = "foto" in caso && !!caso.foto;

  return (
    <section data-hero className="w-full p-[1.6rem]">
      <div className="relative h-[calc(100vh-3.2rem)] min-h-[46rem] w-full overflow-hidden rounded-[2.4rem] bg-ink">
        {temFoto ? (
          <>
            <Image
              src={caso.foto}
              alt={caso.cliente}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/10" />
          </>
        ) : (
          <MediaPlaceholder kind="foto" label={caso.cliente} className="h-full w-full" />
        )}

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-[2.4rem] sm:p-[4rem]">
          <Link
            href="/#cases"
            className="inline-flex w-fit items-center gap-[0.8rem] rounded-full bg-paper/15 backdrop-blur px-[1.6rem] py-[0.9rem] font-mono text-[1.2rem] text-paper hover:bg-paper/25 transition-colors"
          >
            ← Voltar para cases
          </Link>

          <div className="max-w-[60rem] rounded-[1.4rem] bg-paper/10 backdrop-blur-sm p-[2rem] sm:p-[2.8rem]">
            <span className="inline-block rounded-full bg-paper/20 backdrop-blur px-[1.1rem] py-[0.5rem] font-mono text-[0.98rem] text-paper mb-[1.2rem]">
              {caso.servico}
            </span>
            <h1 className="font-display font-semibold uppercase text-paper text-[clamp(2.8rem,6vw,5.6rem)] leading-[1.02] tracking-[-0.02em] text-balance">
              {caso.cliente}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
