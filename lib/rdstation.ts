/**
 * Cliente isolado da API pública de conversão do RD Station Marketing.
 * Único arquivo que conhece o identificador de conta e o formato do payload.
 */

const RD_STATION_CONVERSION_URL = "https://www.rdstation.com.br/api/1.3/conversions";

export type LeadValidado = {
  nome: string;
  whatsapp: string;
  email: string;
  empresa: string;
};

export class RDStationError extends Error {}

export async function enviarParaRDStation(lead: LeadValidado): Promise<void> {
  const token = process.env.RD_STATION_IDENTIFIER;
  if (!token) {
    throw new RDStationError(
      "RD_STATION_IDENTIFIER não configurado. Copie .env.example para .env.local e cole o identificador público de conversão da conta RD Station."
    );
  }

  const response = await fetch(RD_STATION_CONVERSION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token_rdstation: token,
      identificador: "diagnostico-gratuito-site",
      email: lead.email,
      nome: lead.nome,
      cf_whatsapp: lead.whatsapp,
      cf_empresa: lead.empresa,
    }),
  });

  if (!response.ok) {
    throw new RDStationError(`RD Station respondeu ${response.status} ${response.statusText}`);
  }
}
