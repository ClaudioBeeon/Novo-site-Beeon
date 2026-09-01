import { metodo } from "@/lib/content";
import RevealTitle from "@/components/motion/RevealTitle";
import RevealLines from "@/components/motion/RevealLines";

export default function Method() {
  return (
    <section id="agencia" className="site-max" style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}>
      <div className="site-grid">
        <div className="col-span-12 lg:col-span-9">
          <RevealTitle
            as="h2"
            className="font-display font-semibold text-[clamp(2.8rem,4.2vw,4.4rem)] leading-[1.08] tracking-[-0.02em] text-balance mb-[3.2rem]"
          >
            {metodo.titulo}
          </RevealTitle>

          <RevealLines
            lines={[...metodo.paragrafos]}
            className="flex flex-col gap-[2rem] max-w-[62rem]"
            lineClassName="font-mono text-[1.7rem] leading-[1.6]"
          />
        </div>
      </div>
    </section>
  );
}
