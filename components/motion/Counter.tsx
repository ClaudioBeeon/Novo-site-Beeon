"use client";

import { useEffect, useRef } from "react";
import { countUp } from "@/lib/gsap";

export default function Counter({
  value,
  prefixo = "",
  sufixo = "",
  className,
}: {
  value: number;
  prefixo?: string;
  sufixo?: string;
  className?: string;
}) {
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!numRef.current) return;
    countUp(numRef.current, value);
  }, [value]);

  return (
    <span className={className}>
      {prefixo}
      <span ref={numRef}>0</span>
      {sufixo}
    </span>
  );
}
