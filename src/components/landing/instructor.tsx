import Link from "next/link";

/**
 * Quem ensina. A foto e a biografia do Thiago ainda vão chegar:
 * por enquanto o retrato é um espaço reservado com as iniciais.
 */
export function Instructor() {
  return (
    <section id="quem-ensina" className="teacher" aria-labelledby="quem-ensina-title">
      <h2 id="quem-ensina-title" className="teacher__title" data-reveal>
        quem ensina
      </h2>

      <div className="teacher__grid">
        <div className="teacher__portrait" aria-hidden="true" data-reveal>
          <span>TS</span>
        </div>

        <div className="teacher__body">
          <h3 className="teacher__name" data-reveal>
            Thiago Santiago
          </h3>
          <p className="teacher__role" data-reveal>
            Instrutor da Matrix Academy
          </p>
          <p className="teacher__text" data-reveal>
            Thiago conduz todas as aulas do curso, mostrando a operação da Matrix na própria mesa,
            do primeiro canal até a mixagem ao vivo.
          </p>
          <div data-reveal>
            <Link href="/cadastro" className="btn btn--solid">
              Criar conta grátis
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
