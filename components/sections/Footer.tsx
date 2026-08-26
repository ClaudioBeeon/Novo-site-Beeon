import Image from "next/image";
import { footer, site } from "@/lib/content";

export default function Footer() {
  return (
    <footer id="contato" className="site-max" style={{ marginTop: "var(--section-gap)", paddingBottom: "4rem", maxWidth: "124rem" }}>
      <div className="border-t border-rule pt-[4rem] pb-[6rem]">
        <div className="site-grid gap-y-[2.4rem]">
          <div className="col-span-6 sm:col-span-3">
            <p className="font-mono text-[1.1rem] uppercase tracking-[0.08em] text-ink font-medium mb-[1.4rem]">
              Sitemap
            </p>
            <ul className="flex flex-col gap-[0.9rem]">
              {footer.sitemap.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="font-mono text-[1.2rem] text-muted hover:text-azul transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-6 sm:col-span-3">
            <p className="font-mono text-[1.1rem] uppercase tracking-[0.08em] text-ink font-medium mb-[1.4rem]">
              Redes
            </p>
            <ul className="flex flex-col gap-[0.9rem]">
              {footer.socials.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[1.2rem] text-muted hover:text-azul transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between border-t border-rule pt-[3rem]">
        <Image
          src="/brand/beeon-logo-principal.png"
          alt="Beeon"
          width={4417}
          height={3399}
          className="h-[8rem] sm:h-[11rem] w-auto"
        />
        <div className="flex flex-col items-end gap-[1rem]">
          <a href="#top" className="font-mono text-[1.2rem] text-muted hover:text-azul transition-colors">
            Voltar ao topo ↑
          </a>
          <p className="font-mono text-[1.1rem] text-muted">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
