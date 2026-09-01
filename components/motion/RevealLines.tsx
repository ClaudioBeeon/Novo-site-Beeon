"use client";

import { useEffect, useRef } from "react";
import { revealLines } from "@/lib/gsap";

/**
 * Envolve um conjunto de parágrafos e revela cada um, de --muted para
 * --ink, conforme entra na viewport — padrão de motion #2 do sistema.
 */
export default function RevealLines({
  lines,
  className,
  lineClassName,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const els = Array.from(ref.current.querySelectorAll<HTMLElement>(".reveal-line"));
    revealLines(els);
  }, []);

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <p key={i} className={`reveal-line ${lineClassName ?? ""}`}>
          {line}
        </p>
      ))}
    </div>
  );
}
