import Link from "next/link";

/**
 * Cartão centralizado sobre um fundo escuro com a luz azul do site (modelo: cartão de cadastro com
 * marca no topo, título centralizado, campos e um rodapé separado por uma linha).
 */
export function AuthCard({
  title,
  intro,
  children,
  footer,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="authc">
      <div className="authc__backdrop" aria-hidden="true" />
      <section className="authc__card" aria-labelledby="auth-title">
        <header className="authc__head">
          <Link href="/" className="authc__brand">
            Matrix Academy
          </Link>
          <h1 id="auth-title" className="authc__title">
            {title}
          </h1>
          {intro ? <p className="authc__intro">{intro}</p> : null}
        </header>
        <div className="authc__body">{children}</div>
        {footer ? <footer className="authc__foot">{footer}</footer> : null}
      </section>
    </main>
  );
}
