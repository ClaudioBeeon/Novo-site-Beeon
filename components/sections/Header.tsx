"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";
import MenuOverlay from "./MenuOverlay";

export default function Header({ comHero = true }: { comHero?: boolean } = {}) {
  const [overHero, setOverHero] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!comHero) return;
    const hero = document.querySelector("[data-hero]");
    if (!hero) return;
    const onScroll = () => {
      const bottom = hero.getBoundingClientRect().bottom;
      setOverHero(bottom > 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [comHero]);

  const mostrarLogoNav = (comHero ? overHero : true) && !menuOpen;

  return (
    <>
      <header
        className="fixed top-0 left-0 z-[110] w-full"
        style={{ paddingRight: "var(--sbw)" }}
      >
        <div className="site-max grid grid-cols-[1fr_auto_1fr] items-center py-[2.4rem]">
          <a
            href={comHero ? "#top" : "/"}
            className={`flex items-center gap-[0.8rem] shrink-0 justify-self-start transition-opacity duration-300 ${
              mostrarLogoNav ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src="/brand/beeon-logo-horizontal.png"
              alt="Beeon"
              width={2366}
              height={758}
              className={`h-[4.4rem] w-auto ${comHero ? "brightness-0 invert" : ""}`}
              priority
            />
          </a>

          <nav
            className={`hidden lg:flex items-center gap-[0.4rem] justify-self-center rounded-full bg-paper/95 backdrop-blur px-[0.6rem] py-[0.6rem] shadow-[0_0.4rem_1.6rem_rgba(10,10,10,0.12)] transition-opacity duration-300 ${
              mostrarLogoNav ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {nav.slice(1).map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-[1.6rem] py-[0.9rem] font-mono text-[1.2rem] text-ink hover:bg-ground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-[1rem] shrink-0 justify-self-end">
            <a
              href={site.ctaHref}
              className="hidden sm:inline-flex rounded-full bg-paper px-[2rem] py-[1.1rem] font-mono text-[1.2rem] font-medium text-ink shadow-[0_0.4rem_1.6rem_rgba(10,10,10,0.12)] hover:bg-ground transition-colors"
            >
              {site.headerCta}
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              className="inline-flex h-[4.4rem] w-[4.4rem] items-center justify-center rounded-full bg-paper/95 shadow-[0_0.4rem_1.6rem_rgba(10,10,10,0.12)] hover:bg-paper transition-colors"
            >
              <span className="font-mono text-[1.6rem] text-ink">{menuOpen ? "×" : "≡"}</span>
            </button>
          </div>
        </div>
      </header>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
