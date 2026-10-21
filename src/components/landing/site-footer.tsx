import Link from "next/link";
import { Reveal } from "./reveal";
import { WALDMAN_URL } from "./data";

const MATRIX_20 = "https://waldman-music.com/produto/matrix-20/";
const MATRIX_26 = "https://waldman-music.com/produto/matrix-26/";

/** Rodapé de topo arredondado: marca à esquerda, três colunas de links e uma linha final. */
export function SiteFooter() {
  return (
    <footer className="foot">
      <Reveal className="foot__inner">
        <div className="foot__main">
          <div className="foot__brand" data-reveal>
            <Link href="/" className="wordmark">
              Matrix Academy
            </Link>
            <p>
              Curso gratuito em vídeo para operar as mesas digitais Waldman Matrix 20 e Matrix 26,
              com certificado ao final.
            </p>
          </div>

          <div className="foot__cols">
            <nav aria-label="O curso" data-reveal>
              <h3>O curso</h3>
              <ul>
                <li>
                  <a href="#conteudo">A sua jornada</a>
                </li>
                <li>
                  <a href="#passo-a-passo">3 passos</a>
                </li>
                <li>
                  <a href="#assista">Assista quando quiser</a>
                </li>
                <li>
                  <a href="#quem-ensina">O seu professor</a>
                </li>
                <li>
                  <a href="#perguntas">Perguntas frequentes</a>
                </li>
              </ul>
            </nav>
            <nav aria-label="Conta" data-reveal>
              <h3>Conta</h3>
              <ul>
                <li>
                  <Link href="/cadastro">Criar conta</Link>
                </li>
                <li>
                  <Link href="/entrar">Entrar</Link>
                </li>
                <li>
                  <Link href="/esqueci-senha">Esqueci minha senha</Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Waldman" data-reveal>
              <h3>Waldman</h3>
              <ul>
                <li>
                  <a href={MATRIX_20} target="_blank" rel="noopener noreferrer">
                    Matrix 20
                  </a>
                </li>
                <li>
                  <a href={MATRIX_26} target="_blank" rel="noopener noreferrer">
                    Matrix 26
                  </a>
                </li>
                <li>
                  <a href={WALDMAN_URL} target="_blank" rel="noopener noreferrer">
                    Site do fabricante
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="foot__meta">
          <p>© 2026 Matrix Academy. Todos os direitos reservados.</p>
        </div>
      </Reveal>
    </footer>
  );
}
