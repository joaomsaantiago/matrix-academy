import { Reveal } from "./reveal";
import { FaqList } from "./faq-list";
import { FAQ } from "./data";

/** Perguntas frequentes: rótulo, título e descrição centralizados, com o acordeão logo abaixo. */
export function Faq() {
  return (
    <section id="perguntas" className="faqx" aria-labelledby="faq-title">
      <Reveal className="faqx__inner">
        <header className="faqx__head">
          <p className="faqx__label" data-reveal>
            <span aria-hidden="true" />
            FAQ
          </p>
          <h2 id="faq-title" className="faqx__title" data-reveal>
            perguntas frequentes
          </h2>
          <p className="faqx__lead" data-reveal>
            Tudo o que você precisa saber antes de criar a sua conta e começar o curso.
          </p>
        </header>
        <div data-reveal>
          <FaqList items={FAQ} />
        </div>
      </Reveal>
    </section>
  );
}
