"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { MODELS, type Model } from "./data";

const ALWAYS = ["canais", "auxiliares"];

function ModelCard({ model }: { model: Model }) {
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const regionId = useId();
  const open = hover || pinned;

  const stats = model.specs.filter((s) => ALWAYS.includes(s.label));
  const more = model.specs.filter((s) => !ALWAYS.includes(s.label));

  return (
    <div className="mcard-slot" data-reveal>
    <article
      className="mcard"
      data-open={open}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}
      onClick={(e) => {
        // o link da ficha segue o seu caminho sem fechar o cartão
        if ((e.target as HTMLElement).closest("a")) return;
        setPinned((p) => !p);
      }}
    >
      <div className="mcard__row">
        <div className="mcard__photo">
          <Image
            src={model.photo}
            alt={model.alt}
            fill
            sizes="(min-width: 1100px) 12vw, 40vw"
            className="mcard__img"
          />
        </div>

        <div className="mcard__content">
          <button
            type="button"
            className="mcard__toggle"
            aria-expanded={open}
            aria-controls={regionId}
          >
            <span className="mcard__name">{model.name}</span>
            <span className="mcard__plus" aria-hidden="true" />
          </button>

          <dl className="mcard__stats">
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mcard__more" id={regionId} role="region" aria-label={`Detalhes da ${model.name}`}>
            <div className="mcard__more-inner">
              <p className="mcard__text">{model.text}</p>
              <dl className="mcard__specs">
                {more.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={model.url}
                className="mcard__link"
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
              >
                Ficha no site da Waldman
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
    </div>
  );
}

/** As duas mesas lado a lado, em cartões de vidro que se expandem. */
export function ModelShowcase() {
  return (
    <section id="mesa" className="models" data-ghost="mesas" aria-labelledby="mesa-title">
      <div className="models__head">
        <h2 id="mesa-title" className="models__title" data-reveal>
          duas mesas,
          <br />
          um curso
        </h2>
        <p className="models__lead" data-reveal>
          O curso serve para a Matrix 20 e para a Matrix 26. Passe o mouse ou toque em um cartão
          para ver os detalhes.
        </p>
      </div>

      <div className="models__grid">
        {MODELS.map((m) => (
          <ModelCard key={m.id} model={m} />
        ))}
      </div>

      <div className="models__cta" data-reveal>
        <Link href="/cadastro" className="btn btn--solid">
          Criar conta grátis
        </Link>
      </div>
    </section>
  );
}
