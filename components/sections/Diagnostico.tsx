"use client";

import { useActionState } from "react";
import { enviarLead, type EnviarLeadState } from "@/lib/actions/enviar-lead";
import { diagnostico, site } from "@/lib/content";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

const ESTADO_INICIAL: EnviarLeadState = { status: "idle" };

export default function Diagnostico() {
  const [estado, formAction, pendente] = useActionState(enviarLead, ESTADO_INICIAL);
  const erros = estado.status === "erro_validacao" ? estado.erros : {};

  return (
    <section
      id="diagnostico"
      className="site-max"
      style={{ marginTop: "var(--section-gap)", maxWidth: "124rem" }}
    >
      <div className="site-grid items-end gap-y-[3.2rem]">
        <RevealOnScroll className="col-span-12 lg:col-span-6" y={3.2}>
          <p className="font-mono text-[1.2rem] uppercase tracking-[0.08em] text-azul mb-[1.4rem]">
            {diagnostico.eyebrow}
          </p>
          <h2 className="font-display font-extrabold text-[clamp(2.8rem,4.6vw,4.8rem)] leading-[1.03] tracking-[-0.02em] text-balance mb-[1.6rem]">
            {diagnostico.titulo}
          </h2>
          <p className="font-mono text-[1.2rem] leading-[1.5] text-muted max-w-[38rem]">
            {diagnostico.subtitulo}
          </p>
          <div className="flex flex-wrap gap-x-[2.4rem] gap-y-[0.8rem] mt-[2rem] font-mono text-[1.1rem] text-muted">
            {diagnostico.confianca.map((item) => (
              <span key={item} className="flex items-center gap-[0.7rem]">
                <span className="h-[0.6rem] w-[0.6rem] rounded-full bg-sinal" aria-hidden />
                {item}
              </span>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="col-span-12 lg:col-span-6" y={3.2} delay={0.12}>
          <div className="relative rounded-[1.4rem] border border-rule bg-ground p-[2.4rem] sm:p-[3.2rem] overflow-hidden">
            {estado.status === "sucesso" ? (
              <div key="sucesso" className="diagnostico-swap">
                <p className="font-display font-semibold text-[1.8rem] leading-[1.3] mb-[1rem]">
                  Recebemos seu diagnóstico. 🐝
                </p>
                <p className="font-mono text-[1.2rem] text-muted mb-[2rem]">
                  Alguém da equipe fala com você em até 1 dia útil. Se preferir não esperar:
                </p>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-[0.7rem] bg-ink px-[2rem] py-[1.15rem] font-display font-bold text-[1rem] text-paper hover:bg-azul transition-colors"
                >
                  Chamar no WhatsApp agora
                </a>
              </div>
            ) : (
              <form key="form" action={formAction} className="diagnostico-swap" noValidate>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
                />

                <Campo label="Seu nome" name="nome" type="text" placeholder="Como podemos te chamar?" erro={erros.nome} />
                <Campo label="WhatsApp" name="whatsapp" type="tel" placeholder="(16) 90000-0000" erro={erros.whatsapp} />
                <Campo label="E-mail" name="email" type="email" placeholder="voce@empresa.com" erro={erros.email} />
                <Campo label="Empresa" name="empresa" type="text" placeholder="Nome da sua empresa" erro={erros.empresa} last />

                {estado.status === "erro_envio" && (
                  <p className="font-mono text-[1.05rem] text-erro mt-[1.2rem]">
                    Não conseguimos enviar agora. Tente de novo ou chame no{" "}
                    <a href={site.whatsappHref} className="underline">
                      WhatsApp
                    </a>
                    .
                  </p>
                )}

                <button
                  type="submit"
                  disabled={pendente}
                  className="w-full mt-[1.6rem] rounded-[0.7rem] bg-ink px-[2rem] py-[1.15rem] font-display font-bold text-[1rem] text-paper hover:bg-azul transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {pendente ? "Enviando..." : "Quero meu diagnóstico →"}
                </button>
              </form>
            )}
          </div>
        </RevealOnScroll>
      </div>

      <style>{`
        .diagnostico-swap {
          animation: diagnostico-swap 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes diagnostico-swap {
          from { opacity: 0; transform: translateY(1.2rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .diagnostico-swap { animation: none; }
        }
      `}</style>
    </section>
  );
}

function Campo({
  label,
  name,
  type,
  placeholder,
  erro,
  last,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  erro?: string;
  last?: boolean;
}) {
  return (
    <div className={`py-[1.1rem] ${last ? "" : "border-b border-rule"}`}>
      <label
        htmlFor={name}
        className="block font-mono text-[0.72rem] uppercase tracking-[0.06em] text-muted mb-[0.4rem]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="w-full bg-transparent font-mono text-[1.15rem] font-medium text-ink outline-none placeholder:text-muted/70"
      />
      {erro && <p className="font-mono text-[0.85rem] text-erro mt-[0.5rem]">{erro}</p>}
    </div>
  );
}
