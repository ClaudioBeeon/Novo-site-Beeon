import { hero } from "@/lib/content";
import RevealTitle from "@/components/motion/RevealTitle";

export default function Hero() {
  return (
    <section data-hero className="w-full p-[1.6rem]">
      <div className="relative h-[calc(100vh-3.2rem)] min-h-[58rem] w-full overflow-hidden rounded-[2.4rem] bg-azul">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={hero.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        <div className="relative z-10 flex h-full w-full flex-col justify-center">
          <div className="site-max w-full">
            <div className="max-w-[70rem]">
              <RevealTitle
                as="h1"
                className="font-display font-semibold uppercase text-paper text-[clamp(4.4rem,8vw,8.5rem)] leading-[0.98] tracking-[-0.02em] text-balance"
              >
                {hero.headline}
              </RevealTitle>

              <span
                aria-hidden
                className="mt-[2rem] inline-flex h-[4.4rem] w-[4.4rem] items-center justify-center rounded-full bg-paper text-[2.2rem] shadow-lg"
              >
                🐝
              </span>
            </div>

            <p className="mt-[4rem] max-w-[46rem] font-mono text-[1.3rem] tracking-[0.02em] text-paper/85">
              {hero.proof}
            </p>
          </div>

          <div className="absolute bottom-[3.2rem] left-0 w-full site-max flex justify-between items-end">
            <span className="font-mono text-[1.1rem] text-paper/70 uppercase tracking-[0.08em]">
              {hero.scrollLabel}
            </span>
            <span aria-hidden className="font-mono text-[1.4rem] text-paper/70 animate-bounce">
              ↓
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
