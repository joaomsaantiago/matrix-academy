"use client";

import { useState } from "react";
import { STEPS } from "./data";

export function StepsAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <section id="como-funciona" className="steps" data-ghost="passos" aria-labelledby="como-title">
      <div className="steps__intro">
        <h2 id="como-title" className="steps__title" data-reveal>
          como funciona
        </h2>
        <p className="steps__lead" data-reveal>
          Quatro passos, do cadastro ao certificado. Você assiste quando quiser e o sistema guarda o
          seu progresso.
        </p>
      </div>

      <div className="steps__row" data-reveal>
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className={`panel panel--${i + 1}${i === open ? " is-open" : ""}`}
            onClick={() => setOpen(i)}
          >
            <button
              type="button"
              className="panel__tab"
              aria-expanded={i === open}
              onClick={() => setOpen(i)}
              onFocus={() => setOpen(i)}
            >
              <span className="panel__name">{s.title}</span>
            </button>
            <p className="panel__text">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
