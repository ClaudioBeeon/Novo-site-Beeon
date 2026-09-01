import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  (window as unknown as { __ST?: unknown }).__ST = ScrollTrigger;
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Divide um nó de texto em spans por palavra, preservando os espaços. */
export function splitWords(el: HTMLElement) {
  const text = el.textContent ?? "";
  el.textContent = "";
  const words = text.split(/(\s+)/);
  const spans: HTMLSpanElement[] = [];
  words.forEach((word) => {
    if (word.trim() === "") {
      el.appendChild(document.createTextNode(word));
      return;
    }
    const span = document.createElement("span");
    span.className = "reveal-word";
    span.textContent = word;
    el.appendChild(span);
    spans.push(span);
  });
  return spans;
}

/** Reveal padrão 1: título revela palavra por palavra ao entrar na viewport. */
export function revealWords(el: HTMLElement, trigger?: Element) {
  if (prefersReducedMotion()) return;
  const words = splitWords(el);
  gsap.to(words, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.045,
    ease: "power3.out",
    scrollTrigger: {
      trigger: trigger ?? el,
      start: "top 85%",
      once: true,
    },
  });
}

/** Reveal padrão 2: parágrafo(s) passam de --muted para --ink linha a linha. */
export function revealLines(els: HTMLElement[]) {
  if (prefersReducedMotion()) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }
  els.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => el.classList.add("is-in"),
    });
  });
}

/** Reveal padrão 3: número sobe por contagem ao entrar na viewport. */
export function countUp(
  el: HTMLElement,
  target: number,
  opts: { duration?: number; trigger?: Element } = {}
) {
  if (prefersReducedMotion()) {
    el.textContent = String(target);
    return;
  }
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: opts.duration ?? 1.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: opts.trigger ?? el,
      start: "top 85%",
      once: true,
    },
    onUpdate: () => {
      el.textContent = Math.round(obj.val).toLocaleString("pt-BR");
    },
  });
}

export { gsap, ScrollTrigger };
