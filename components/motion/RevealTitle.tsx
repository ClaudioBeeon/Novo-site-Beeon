"use client";

import { useEffect, useRef } from "react";
import { revealWords } from "@/lib/gsap";

type Tag = "h1" | "h2" | "h3";

export default function RevealTitle({
  as: Tag = "h2",
  className,
  children,
}: {
  as?: Tag;
  className?: string;
  children: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    revealWords(ref.current);
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
