import type { Metadata } from "next";
import { Figtree, League_Spartan, Orbitron } from "next/font/google";
import "./globals.css";

// Títulos e textos do site
const display = League_Spartan({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700"],
});
const text = Figtree({
  variable: "--font-text",
  subsets: ["latin"],
  weight: ["400", "600"],
});
// Só o nome "Matrix Academy" usa esta fonte, mais tecnológica
const brand = Orbitron({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Matrix Academy: curso gratuito da mesa Waldman Matrix",
    template: "%s · Matrix Academy",
  },
  description:
    "Curso gratuito em vídeo para operar as mesas digitais Waldman Matrix 20 e Matrix 26, com certificado ao final.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${text.variable} ${brand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
