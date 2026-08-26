import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cases, site } from "@/lib/content";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import CaseHero from "@/components/sections/CaseHero";
import CaseBody from "@/components/sections/CaseBody";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caso = cases.find((c) => c.slug === slug);
  if (!caso) return {};

  const temConteudoReal = "foto" in caso && !!caso.foto;

  return {
    title: `${caso.cliente} — Case ${site.nome}`,
    description:
      "resumo" in caso && caso.resumo
        ? caso.resumo
        : `Case de ${caso.servico} da ${caso.cliente}, por ${site.nome}.`,
    robots: temConteudoReal ? undefined : { index: false, follow: true },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = cases.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();

  const caso = cases[index];
  const proximo = cases[(index + 1) % cases.length];

  return (
    <>
      <Header />
      <main>
        <CaseHero caso={caso} />
        <CaseBody caso={caso} proximo={proximo} />
      </main>
      <Footer />
    </>
  );
}
