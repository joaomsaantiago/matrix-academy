import Link from "next/link";
import { WALDMAN_URL } from "./data";

const MATRIX_20 = "https://waldman-music.com/produto/matrix-20/";
const MATRIX_26 = "https://waldman-music.com/produto/matrix-26/";

export function SiteFooter() {
  return (
    <footer className="foot" data-word="matrix">
      <div className="foot__panel">
        <div className="foot__cta">
          <h2 className="foot__headline">comece hoje.
            <br />
            é de graça.
          </h2>
          <Link href="/cadastro" className="pillbtn">
            <span className="pillbtn__label">Criar conta grátis</span>
            <span className="pillbtn__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>

        <div className="foot__cols">
          <nav aria-label="O curso">
            <h3>O curso</h3>
            <a href="#conteudo">A sua jornada</a>
            <a href="#assista">Assista quando quiser</a>
            <a href="#quem-ensina">Quem ensina</a>
            <a href="#perguntas">Perguntas frequentes</a>
          </nav>
          <nav aria-label="Conta">
            <h3>Conta</h3>
            <Link href="/cadastro">Criar conta</Link>
            <Link href="/entrar">Entrar</Link>
            <Link href="/esqueci-senha">Esqueci minha senha</Link>
          </nav>
          <nav aria-label="Waldman">
            <h3>Waldman</h3>
            <a href={MATRIX_20} target="_blank" rel="noopener noreferrer">
              Matrix 20
            </a>
            <a href={MATRIX_26} target="_blank" rel="noopener noreferrer">
              Matrix 26
            </a>
            <a href={WALDMAN_URL} target="_blank" rel="noopener noreferrer">
              Site do fabricante
            </a>
          </nav>
        </div>
      </div>

      <div className="foot__meta">
        <p>© 2026 Matrix Academy</p>
        <p>Fotos e informações técnicas das mesas: Waldman, usadas com autorização.</p>
      </div>
    </footer>
  );
}
