import Link from "next/link";

/** A faixa inteira é o botão. */
export function CtaBand() {
  return (
    <Link href="/cadastro" className="cta" aria-label="Começar o curso grátis: criar conta">
      <span className="cta__text">Seu certificado começa com uma conta gratuita.</span>
      <svg className="cta__arrow" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M14 34 34 14M16 14h18v18" fill="none" stroke="currentColor" strokeWidth="4" />
      </svg>
      <span className="cta__word" aria-hidden="true">
        começar
      </span>
    </Link>
  );
}
