/**
 * Marcador visual para onde entra foto ou vídeo real. Usa as cores da
 * marca (azul + amarelo) para ficar óbvio que é um placeholder — não
 * um cinza neutro genérico. Basta substituir por <Image> ou <video>
 * quando o asset chegar.
 */
export default function MediaPlaceholder({
  label,
  kind = "vídeo",
  className,
}: {
  label?: string;
  kind?: "vídeo" | "foto";
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className ?? ""}`}
      style={{
        background:
          "repeating-linear-gradient(135deg, var(--azul) 0px, var(--azul) 14px, var(--azul-dim) 14px, var(--azul-dim) 28px)",
      }}
    >
      <div className="absolute inset-[0.6rem] border-2 border-dashed border-sinal/70 flex flex-col items-center justify-center gap-[0.8rem] text-center px-[1.6rem]">
        <span className="font-mono text-[1.1rem] tracking-[0.08em] uppercase text-paper bg-ink/70 px-[1rem] py-[0.4rem] rounded-full">
          {kind === "vídeo" ? "▶ vídeo" : "◇ foto"}
        </span>
        {label && (
          <span className="font-mono text-[1.1rem] text-paper/90">{label}</span>
        )}
      </div>
    </div>
  );
}
