import Link from "next/link";
import { Reveal } from "./reveal";
import { MODULES, TOTAL_LESSONS } from "./data";

const STEPS = [
  {
    title: "Crie sua conta",
    text: "Cadastro gratuito, só com nome, e-mail e senha. Sem cartão e sem pegadinha.",
    reveal: "left",
  },
  {
    title: "Assista às aulas",
    text: `${MODULES.length} módulos em vídeo, no seu ritmo e no horário que quiser. O progresso fica salvo e você continua de onde parou.`,
    reveal: "rise",
  },
  {
    title: "Receba o certificado",
    text: "Concluiu todos os módulos? O certificado sai na hora, com um código para qualquer pessoa conferir.",
    reveal: "right",
  },
] as const;

export function PassoAPasso() {
  return (
    <section id="passo-a-passo" className="steps3" aria-labelledby="passos-title">
      <Reveal className="steps3__inner">
        <header className="steps3__head">
          <h2 id="passos-title" className="steps3__title" data-reveal="left">
            3 passos
          </h2>
          <p className="steps3__lead" data-reveal="right">
            Do cadastro ao certificado, sem complicação.
          </p>
        </header>

        <ol className="steps3__list">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step3" data-reveal={s.reveal}>
              <span className="step3__num" aria-hidden="true">
                {i + 1}
              </span>
              <div className={`step3__art step3__art--${i + 1}`} aria-hidden="true">
                {i === 0 && (
                  <>
                    <span className="step3__field">nome</span>
                    <span className="step3__field">e-mail</span>
                    <span className="step3__pill">Criar conta</span>
                  </>
                )}
                {i === 1 && (
                  <>
                    <span className="step3__play" />
                    <span className="step3__bar">
                      <span />
                    </span>
                    <span className="step3__meta">{TOTAL_LESSONS} aulas</span>
                  </>
                )}
                {i === 2 && (
                  <>
                    <span className="step3__seal" />
                    <span className="step3__cert">Certificado de conclusão</span>
                    <span className="step3__line" />
                  </>
                )}
              </div>
              <h3 className="step3__name">{s.title}</h3>
              <p className="step3__text">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="steps3__cta" data-reveal>
          <Link href="/cadastro" className="btn btn--accent">
            Começar pelo passo 1
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
