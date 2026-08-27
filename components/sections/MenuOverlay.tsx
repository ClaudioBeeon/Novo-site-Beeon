"use client";

import { useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { nav, site, hero } from "@/lib/content";
import { hrefEmContexto } from "@/lib/nav";

export default function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.documentElement.style.overflow;
    const prevPaddingRight = document.documentElement.style.paddingRight;
    document.documentElement.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.setProperty("--sbw", `${scrollbarWidth}px`);
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      document.documentElement.style.paddingRight = prevPaddingRight;
      document.documentElement.style.setProperty("--sbw", "0px");
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
      className="menu-overlay fixed inset-0 z-[100] flex text-paper"
    >
      {/* painel esquerdo */}
      <div className="hidden sm:flex w-[26%] shrink-0 flex-col justify-between bg-azul-dim p-[3.2rem]">
        <Image
          src="/brand/beeon-logo-principal.png"
          alt="Beeon"
          width={4417}
          height={3399}
          className="h-[5.4rem] w-auto self-start shrink-0 brightness-0 invert"
          style={{ objectFit: "contain" }}
        />
        <div>
          <span className="inline-block h-[0.8rem] w-[0.8rem] rounded-full bg-sinal mb-[1.2rem]" />
          <p className="font-mono text-[1.2rem] leading-[1.6] text-paper/85 max-w-[22rem]">
            {hero.proof}
          </p>
        </div>
      </div>

      {/* painel direito */}
      <div className="relative flex-1 bg-azul overflow-y-auto">
        <div className="site-max">
          <div className="flex items-center justify-between py-[2.4rem]">
            <p className="font-mono text-[1.2rem] uppercase tracking-[0.1em] text-paper/70">
              Navegação
            </p>
            {/* espaço reservado: o botão de fechar é o mesmo hambúrguer do header, fixo por cima */}
            <div className="h-[4.4rem] w-[16rem] sm:w-[22rem]" aria-hidden />
          </div>

          <nav className="mt-[2rem] sm:mt-[4rem]">
            <ul>
              {nav.map((item, i) => (
                <li key={item.href} className="menu-item-rise" style={{ animationDelay: `${i * 60}ms` }}>
                  <a
                    href={hrefEmContexto(item.href, pathname)}
                    onClick={onClose}
                    className="group flex items-baseline gap-[1.2rem] py-[1rem] sm:py-[1.4rem]"
                  >
                    <span className="font-display font-semibold text-[clamp(3.4rem,7vw,7rem)] leading-[1.05] tracking-[-0.02em] text-paper group-hover:text-sinal transition-colors">
                      {item.label}
                    </span>
                    <sup className="font-mono text-[1.2rem] text-paper/50">
                      {String(i + 1).padStart(2, "0")}
                    </sup>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-[4rem] pb-[3.2rem] flex flex-col sm:flex-row sm:items-end justify-between gap-[2rem]">
            <div>
              <p className="font-mono text-[1.2rem] text-paper/70">{site.local}</p>
              <a
                href={`mailto:${site.email}`}
                className="font-display font-semibold text-[2rem] text-paper hover:text-sinal transition-colors"
              >
                {site.email}
              </a>
            </div>
            <p className="font-mono text-[1.1rem] text-paper/50">
              © {site.nome} {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .menu-overlay {
          animation: menu-fade 0.35s ease both;
        }
        @keyframes menu-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .menu-item-rise {
          animation: menu-item-rise 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
        }
        @keyframes menu-item-rise {
          from { opacity: 0; transform: translateY(1.4rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .menu-overlay, .menu-item-rise { animation: none; }
        }
      `}</style>
    </div>
  );
}
