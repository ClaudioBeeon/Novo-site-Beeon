"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Envolve qualquer conteúdo e revela com um leve subir + fade ao
 * entrar na viewport. Usado em cards, imagens e blocos de texto que
 * hoje aparecem estáticos assim que a página carrega.
 */
export default function RevealOnScroll({
  children,
  className,
  delay = 0,
  y = 2.4,
  duration = 0.7,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(el, { opacity: 0, y: `${y}rem` });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
        });
      },
    });

    return () => trigger.kill();
  }, [delay, y, duration]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
