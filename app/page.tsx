import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Clientes from "@/components/sections/Clientes";
import Showcase from "@/components/sections/Showcase";
import Stats from "@/components/sections/Stats";
import Premios from "@/components/sections/Premios";
import Cases from "@/components/sections/Cases";
import Method from "@/components/sections/Method";
import Testimonials from "@/components/sections/Testimonials";
import Blog from "@/components/sections/Blog";
import Diagnostico from "@/components/sections/Diagnostico";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Clientes />
        <Showcase />
        <Stats />
        <Premios />
        <Cases />
        <Method />
        <Testimonials />
        <Blog />
        <Diagnostico />
      </main>
      <Footer />
    </>
  );
}
