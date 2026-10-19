import { FAQ } from "./data";

export function Faq() {
  return (
    <section id="perguntas" className="faq" aria-labelledby="faq-title">
      <h2 id="faq-title" className="faq__title" data-reveal>
        perguntas
        <br />
        frequentes
      </h2>
      <div className="faq__list">
        {FAQ.map((item) => (
          <details key={item.q} name="faq" className="tile" data-reveal>
            <summary className="tile__q">
              <span>{item.q}</span>
              <span className="tile__plus" aria-hidden="true" />
            </summary>
            <p className="tile__a">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
