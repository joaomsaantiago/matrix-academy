import { Reveal } from "./reveal";
import { StepsCard } from "./steps-card";

/** 3 passos: do cadastro ao certificado. O cartão animado fica em steps-card.tsx. */
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

        <div data-reveal="rise">
          <StepsCard />
        </div>
      </Reveal>
    </section>
  );
}
