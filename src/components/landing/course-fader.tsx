"use client";

import { useEffect, useRef, useState } from "react";
import { MODULES, TOTAL_LESSONS } from "./data";

/**
 * Conteúdo do curso como um fader de mesa de som.
 * Ao rolar a seção, o fader sobe de -60 dB até 0 dB, um módulo por vez.
 */

// Curva do fader: posição (0 a 1) para cada valor em dB, como a escala de uma mesa de verdade.
const TAPER: [number, number][] = [
  [-60, 0],
  [-40, 0.17],
  [-20, 0.4],
  [-10, 0.6],
  [-5, 0.73],
  [0, 0.86],
  [5, 0.94],
  [10, 1],
];

function posOf(db: number) {
  for (let i = 1; i < TAPER.length; i++) {
    const [d1, p1] = TAPER[i];
    const [d0, p0] = TAPER[i - 1];
    if (db <= d1) return p0 + ((db - d0) / (d1 - d0)) * (p1 - p0);
  }
  return 1;
}

const MAJOR = [-60, -40, -20, -10, -5, 0, 5, 10];
const MINOR = Array.from({ length: 15 }, (_, i) => -60 + i * 5);

export function CourseFader() {
  const section = useRef<HTMLElement>(null);
  const fader = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const N = MODULES.length;

  useEffect(() => {
    const sec = section.current;
    const fd = fader.current;
    if (!sec || !fd) return;

    const labels = Array.from(fd.querySelectorAll<HTMLElement>("[data-db]"));
    let target = 0;
    let shown = 0;
    let raf = 0;
    let running = false;

    const measure = () => {
      const rect = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      target = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    };

    const render = () => {
      const db = -60 + 60 * shown;
      fd.style.setProperty("--pos", String(posOf(db)));
      fd.dataset.top = shown > 0.995 ? "1" : "0";
      for (const l of labels) {
        l.classList.toggle("is-passed", Number(l.dataset.db) <= db + 0.01);
      }
    };

    const tick = () => {
      shown += (target - shown) * 0.14;
      if (Math.abs(target - shown) < 0.0006) shown = target;
      render();
      setIndex((prev) => {
        const next = Math.min(N - 1, Math.floor(shown * N));
        return prev === next ? prev : next;
      });
      if (shown !== target) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const kick = () => {
      measure();
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    measure();
    shown = target;
    render();
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
    };
  }, [N]);

  const goTo = (i: number) => {
    const sec = section.current;
    if (!sec) return;
    const total = sec.offsetHeight - window.innerHeight;
    const top = sec.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((i + 0.5) / N) * total, behavior: "smooth" });
  };

  const current = MODULES[index];

  return (
    <section
      id="conteudo"
      ref={section}
      className="course"
      style={{ "--modules": N } as React.CSSProperties}
      aria-labelledby="conteudo-title"
    >
      <div className="course__stage">
        <header className="course__head">
          <h2 id="conteudo-title" className="course__title">a sua jornada</h2>
        </header>

        <div className="fader" ref={fader} data-top="0" style={{ "--pos": 0 } as React.CSSProperties}>
          <div className="fader__body" aria-hidden="true">
            <div className="fader__travel">
              {MINOR.map((db) => (
                <span
                  key={`t${db}`}
                  className={`fader__tick${MAJOR.includes(db) ? " is-major" : ""}`}
                  style={{ "--p": posOf(db) } as React.CSSProperties}
                />
              ))}
              {MAJOR.map((db) => (
                <span
                  key={`l${db}`}
                  className="fader__label"
                  data-db={db}
                  style={{ "--p": posOf(db) } as React.CSSProperties}
                >
                  {db > 0 ? `+${db}` : db}
                </span>
              ))}
            </div>
            <div className="fader__track">
              <div className="fader__travel">
                <span className="fader__fill" />
                <span className="fader__cap" />
              </div>
            </div>
          </div>
        </div>

        <div className="course__module" key={index} aria-live="polite">
          <p className="course__count">
            Módulo {index + 1} de {N} · {current.lessons} aulas
          </p>
          <h3 className="course__name">{current.title}</h3>
          <p className="course__text">{current.text}</p>
        </div>

        <ol className="course__list">
          {MODULES.map((m, i) => (
            <li key={m.title}>
              <button
                type="button"
                className={`course__item${i === index ? " is-current" : i < index ? " is-done" : ""}`}
                onClick={() => goTo(i)}
                aria-current={i === index ? "step" : undefined}
              >
                {m.title}
              </button>
            </li>
          ))}
          <li className="course__total">{TOTAL_LESSONS} aulas no total</li>
        </ol>
      </div>
    </section>
  );
}
