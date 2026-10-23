import Link from "next/link";

/** Página de conta: formulário à esquerda e, à direita, um quadro da capa com a chamada do curso. */
export function AuthShell({
  title,
  intro,
  children,
  footer,
  wide,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** formulário mais largo (cadastro: campos em duas colunas) */
  wide?: boolean;
}) {
  return (
    <main className="authp">
      <div className="authp__main">
        <div className="authp__top">
          <Link href="/" className="authp__brand">
            Matrix Academy
          </Link>
        </div>

        <section className={`authp__form${wide ? " authp__form--wide" : ""}`} aria-labelledby="auth-title">
          <h1 id="auth-title" className="authp__title">
            {title}
          </h1>
          {intro ? <p className="authp__intro">{intro}</p> : null}
          <div className="authp__body">{children}</div>
          {footer ? <footer className="authp__foot">{footer}</footer> : null}
        </section>
      </div>

      <aside className="authp__art" aria-hidden="true">
        <p className="authp__kicker">Curso gratuito</p>
        <p className="authp__headline">Domine a Waldman Matrix</p>
        <ul className="authp__points">
          <li>Aulas em vídeo, no seu ritmo</li>
          <li>Matrix 20 e Matrix 26</li>
          <li>Certificado ao concluir</li>
        </ul>
      </aside>
    </main>
  );
}
