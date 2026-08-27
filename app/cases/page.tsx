import type { Metadata } from "next";
import { cases, site } from "@/lib/content";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import CasesMosaic from "@/components/sections/CasesMosaic";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

export const metadata: Metadata = {
  title: `Cases — ${site.nome}`,
  description: `Resultado real, para clientes reais: ${cases.length} cases de Inbound Marketing, Tráfego Pago, SEO e Performance da ${site.nome}.`,
};

export default function CasesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="site-max" style={{ marginTop: "16rem", maxWidth: "124rem" }}>
          <RevealOnScroll className="mb-[5rem] block">
            <p className="font-mono text-[1.2rem] tracking-[0.1em] text-azul uppercase mb-[1.2rem]">
              Cases
            </p>
            <h1 className="font-display font-semibold text-[clamp(3rem,5vw,5.6rem)] leading-[1.02] tracking-[-0.02em] text-balance max-w-[26ch]">
              Resultado real, para clientes reais.
            </h1>
          </RevealOnScroll>
        </section>

        <section className="site-max" style={{ marginTop: "4rem", maxWidth: "124rem" }}>
          <CasesMosaic />
        </section>
      </main>
      <Footer />
    </>
  );
}
