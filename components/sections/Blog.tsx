"use client";

import { useState } from "react";
import { blog } from "@/lib/content";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

const VISIBLE = 3;

export default function Blog() {
  const [start, setStart] = useState(0);
  const total = blog.length;

  const visible = Array.from({ length: Math.min(VISIBLE, total) }, (_, i) => blog[(start + i) % total]);

  const next = () => setStart((s) => (s + 1) % total);
  const prev = () => setStart((s) => (s - 1 + total) % total);

  return (
    <section
      id="blog"
      className="relative overflow-hidden bg-ink text-paper"
      style={{ marginTop: "var(--section-gap)", paddingTop: "13.5rem", paddingBottom: "12.5rem" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[20rem] -left-[10rem] h-[48rem] w-[48rem] rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, var(--azul) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[10rem] left-[8rem] h-[34rem] w-[34rem] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, var(--azul-dim) 0%, transparent 70%)" }}
      />

      <div className="site-max relative" style={{ maxWidth: "124rem" }}>
        <div className="mb-[7rem] flex flex-col sm:flex-row sm:items-end justify-between gap-[2.4rem]">
          <RevealOnScroll>
            <p className="font-mono text-[1.2rem] tracking-[0.1em] text-sinal uppercase mb-[1.2rem]">
              06 — Blog
            </p>
            <h2 className="font-display font-semibold text-[clamp(2.6rem,3.8vw,4rem)] leading-[1.05] tracking-[-0.02em]">
              Últimos posts
            </h2>
          </RevealOnScroll>

          <label className="w-full sm:w-[26rem]">
            <span className="sr-only">Buscar posts</span>
            <div className="flex items-center justify-between border-b border-white/25 pb-[1rem]">
              <input
                type="search"
                placeholder="Buscar posts..."
                className="w-full bg-transparent font-mono text-[1.3rem] text-paper placeholder:text-white/40 outline-none"
              />
              <span aria-hidden className="font-mono text-[1.3rem] text-white/50">
                ↗
              </span>
            </div>
          </label>
        </div>

        <RevealOnScroll className="grid grid-cols-1 sm:grid-cols-3 gap-[3.2rem]" y={3.2}>
          {visible.map((post, i) => (
            <a
              key={`${post.titulo}-${start}`}
              href={post.href}
              className="blog-card-rise group block"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[1rem]">
                <MediaPlaceholder kind="foto" label={post.categoria} className="h-full w-full" />
              </div>
              <p className="mt-[1.4rem] font-mono text-[1.02rem] uppercase tracking-[0.04em] text-sinal">
                {post.categoria} <span className="text-white/40 normal-case">· {post.data}</span>
              </p>
              <h3 className="mt-[0.6rem] font-display font-semibold text-[1.5rem] leading-[1.3] tracking-[-0.005em] text-paper group-hover:text-sinal transition-colors">
                {post.titulo}
              </h3>
              <p className="mt-[0.6rem] font-mono text-[1.08rem] leading-[1.5] text-white/55">
                {post.resumo}
              </p>
            </a>
          ))}
        </RevealOnScroll>

        <div className="mt-[4.8rem] flex items-center justify-between">
          <div className="flex items-center gap-[1.2rem]">
            <button
              type="button"
              onClick={prev}
              aria-label="Post anterior"
              className="inline-flex h-[4rem] w-[4rem] items-center justify-center rounded-full border border-white/25 text-paper hover:border-sinal hover:text-sinal transition-colors"
            >
              ←
            </button>
            <span className="font-mono text-[1.2rem] text-white/50 tabular-nums">
              {String(start + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={next}
              aria-label="Próximo post"
              className="inline-flex h-[4rem] w-[4rem] items-center justify-center rounded-full border border-white/25 text-paper hover:border-sinal hover:text-sinal transition-colors"
            >
              →
            </button>
          </div>

          <a
            href="/blog"
            className="rounded-full border border-white/25 px-[2.2rem] py-[1.1rem] font-mono text-[1.2rem] text-paper hover:border-sinal hover:text-sinal transition-colors"
          >
            Ver todos os posts
          </a>
        </div>
      </div>

      <style>{`
        .blog-card-rise {
          animation: blog-card-rise 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
        }
        @keyframes blog-card-rise {
          from { opacity: 0; transform: translateY(1rem) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .blog-card-rise { animation: none; }
        }
      `}</style>
    </section>
  );
}
