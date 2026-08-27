import type { Metadata } from "next";
import { site } from "@/lib/content";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import BlogEditorial from "@/components/sections/BlogEditorial";

export const metadata: Metadata = {
  title: `Blog — ${site.nome}`,
  description: `Ideias sobre Inbound Marketing, Tráfego Pago, SEO e Performance, direto da equipe da ${site.nome}.`,
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main style={{ marginTop: "8rem" }}>
        <BlogEditorial />
      </main>
      <Footer />
    </>
  );
}
