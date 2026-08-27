import { site } from "@/lib/content";

/**
 * Canal persistente de baixo atrito. Fica em bg-sinal (amarelo) porque essa
 * cor hoje só aparece como acento pontual — nunca como botão grande — então
 * o elemento se destaca contra qualquer seção sem brigar com os CTAs azuis.
 */
export default function WhatsAppButton() {
  return (
    <a
      href={site.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-[2.4rem] right-[2.4rem] z-40 inline-flex h-[5.6rem] w-[5.6rem] items-center justify-center rounded-full bg-sinal text-ink shadow-[0_0.6rem_2rem_rgba(10,10,10,0.18)] transition-transform hover:scale-105 motion-reduce:hover:scale-100"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 2a10 10 0 0 0-8.61 15.06L2 22l5.06-1.36A10 10 0 1 0 12 2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 8.6c.2-.5.5-.5.8-.5h.6c.2 0 .4 0 .6.4.2.5.7 1.6.7 1.7.1.1.1.3 0 .4-.1.2-.2.3-.3.4-.1.2-.3.3-.4.5-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.5 1.6.3.1.4.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.8.3.1.5.2.5.3.1.2.1.9-.2 1.5-.3.7-1.5 1.3-2.1 1.4-.6.1-1.1.2-3.5-.7-2.9-1.2-4.8-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2Z"
          fill="currentColor"
        />
      </svg>
    </a>
  );
}
