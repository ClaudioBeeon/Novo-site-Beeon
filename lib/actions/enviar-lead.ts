"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { enviarParaRDStation, RDStationError } from "@/lib/rdstation";

const leadSchema = z.object({
  nome: z.string().trim().min(2, "Digite seu nome completo."),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/, "Digite um WhatsApp válido com DDD."),
  email: z.string().trim().email("Digite um e-mail válido."),
  empresa: z.string().trim().min(2, "Digite o nome da sua empresa."),
});

type CampoLead = "nome" | "whatsapp" | "email" | "empresa";

export type EnviarLeadState =
  | { status: "idle" }
  | { status: "erro_validacao"; erros: Partial<Record<CampoLead, string>> }
  | { status: "erro_envio" }
  | { status: "sucesso" };

// Limite básico por IP. Em memória por instância de servidor: suficiente para
// o volume esperado deste site, mas não é uma garantia forte em ambientes
// serverless com múltiplas instâncias simultâneas — se o tráfego crescer,
// trocar por um rate limit compartilhado (ex.: Upstash Redis).
const JANELA_MS = 10 * 60 * 1000;
const LIMITE_ENVIOS = 5;
const enviosPorIp = new Map<string, { count: number; resetAt: number }>();

function excedeuLimite(ip: string): boolean {
  const agora = Date.now();
  const registro = enviosPorIp.get(ip);
  if (!registro || agora > registro.resetAt) {
    enviosPorIp.set(ip, { count: 1, resetAt: agora + JANELA_MS });
    return false;
  }
  registro.count += 1;
  return registro.count > LIMITE_ENVIOS;
}

export async function enviarLead(
  _estadoAnterior: EnviarLeadState,
  formData: FormData
): Promise<EnviarLeadState> {
  // Honeypot: campo invisível que só um bot preenche. Retorna sucesso
  // "falso" — não entrega ao RD Station, mas também não avisa o bot de
  // que foi bloqueado, o que evitaria uma nova tentativa mais sofisticada.
  if (formData.get("website")) {
    return { status: "sucesso" };
  }

  const cabecalhos = await headers();
  const ip = cabecalhos.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconhecido";
  if (excedeuLimite(ip)) {
    return { status: "sucesso" };
  }

  const resultado = leadSchema.safeParse({
    nome: formData.get("nome"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    empresa: formData.get("empresa"),
  });

  if (!resultado.success) {
    const erros: Partial<Record<CampoLead, string>> = {};
    for (const issue of resultado.error.issues) {
      const campo = issue.path[0];
      if (typeof campo === "string") {
        erros[campo as CampoLead] = issue.message;
      }
    }
    return { status: "erro_validacao", erros };
  }

  try {
    await enviarParaRDStation(resultado.data);
    return { status: "sucesso" };
  } catch (erro) {
    console.error(
      "Falha ao enviar lead para o RD Station:",
      erro instanceof RDStationError ? erro.message : erro
    );
    return { status: "erro_envio" };
  }
}
