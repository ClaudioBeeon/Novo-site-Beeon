import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Beeon — Agência de Marketing de Performance",
  description:
    "A Beeon é uma agência de marketing de performance em Ribeirão Preto/SP e Passos/MG, especialista em Inbound Marketing, Tráfego Pago e SEO.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <SmoothScroll />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
