import Image from "next/image";
import Link from "next/link";

export function About() {
  return (
    <section id="instrutor" className="about" aria-labelledby="instrutor-title">
      <div className="about__panel">
        <h2 id="instrutor-title" className="about__title" data-reveal>
          aprenda com
          <br />
          thiago santiago
        </h2>

        <div className="about__cols">
          <div data-reveal>
            <h3 className="about__sub">Aulas direto na mesa</h3>
            <p>
              Cada episódio mostra a operação da Matrix passo a passo, do primeiro canal à saída
              principal.
            </p>
          </div>
          <div data-reveal>
            <h3 className="about__sub">Do básico ao ao vivo</h3>
            <p>
              Dos primeiros cabos à operação em culto, evento ou estúdio, com a camada de faders
              sempre à vista.
            </p>
          </div>
          <Link href="/cadastro" className="btn btn--accent" data-reveal>
            Criar conta grátis
          </Link>
        </div>

        <div className="about__photo" aria-hidden="true" data-reveal>
          <Image
            src="/img/matrix/matrix26-3.png"
            alt=""
            fill
            sizes="(min-width: 900px) 38vw, 86vw"
            className="about__img"
          />
        </div>
      </div>
    </section>
  );
}
