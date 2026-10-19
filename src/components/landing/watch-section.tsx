"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { EPISODES, MODULES, formatTime, type Episode } from "./data";

/**
 * Miniatura 16:9: um recorte (zoom) da foto da Matrix ligada ao módulo da aula.
 * A foto é retrato (1200x1450); aqui calculamos qual faixa dela aparece e onde dar o zoom.
 */
const BAND = 9 / 16 / (1450 / 1200); // fração da altura da foto visível numa miniatura 16:9

function Thumb({ episode, sizes }: { episode: Episode; sizes: string }) {
  const m = MODULES[episode.module];
  // aulas do mesmo módulo ganham recortes ligeiramente diferentes
  const n = Number(episode.id.slice(1));
  const fx = Math.min(95, Math.max(5, m.focus.x + ((n % 3) - 1) * 9));
  const fy = Math.min(95, Math.max(5, m.focus.y + (n % 2 === 0 ? 5 : -5)));
  const py = Math.min(100, Math.max(0, ((fy / 100 - BAND / 2) / (1 - BAND)) * 100));
  return (
    <Image
      src={m.photo}
      alt=""
      fill
      sizes={sizes}
      className="thumb__img"
      style={{
        objectPosition: `50% ${py}%`,
        transformOrigin: `${fx}% 50%`,
        transform: `scale(${Math.max(1.5, m.focus.zoom)})`,
      }}
    />
  );
}

function statusOf(e: Episode) {
  if (e.watched >= e.duration) return "Aula concluída";
  if (e.watched > 0) return `Você parou em ${formatTime(e.watched)}`;
  return "Ainda não assistida";
}

/**
 * Vitrine da área de membros: um player em destaque e uma fileira de aulas
 * com a barra de progresso de cada uma, no estilo de uma plataforma de streaming.
 */
export function WatchSection() {
  const [active, setActive] = useState(2); // abre na aula em que o aluno de exemplo parou
  const rail = useRef<HTMLDivElement>(null);
  const ep = EPISODES[active];
  const mod = MODULES[ep.module];
  const pct = Math.round((ep.watched / ep.duration) * 100);
  const resumable = ep.watched > 0 && ep.watched < ep.duration;

  const scrollRail = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section id="assista" className="watch" aria-labelledby="assista-title">
      <h2 id="assista-title" className="watch__title" data-reveal>
        assista
        <br />
        quando quiser
      </h2>

      <div className="watch__stage" data-reveal>
        <div className="player" data-resumable={resumable}>
          <div className="thumb player__thumb" key={ep.id}>
            <Thumb episode={ep} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>

          {resumable ? <span className="player__chip">Continuar de onde parou</span> : null}

          <Link href="/cadastro" className="player__play" aria-label="Criar conta grátis para assistir">
            <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </Link>

          <div className="player__bar" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" className="player__icon">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
            <div className="player__track">
              <span className="player__fill" style={{ width: `${pct}%` }} />
              <span className="player__knob" style={{ left: `${pct}%` }} />
            </div>
            <span className="player__time">
              {formatTime(ep.watched)} / {formatTime(ep.duration)}
            </span>
          </div>
        </div>

        <div className="watch__info" key={`info-${ep.id}`}>
          <p className="watch__module">{mod.title}</p>
          <h3 className="watch__ep">{ep.title}</h3>
          <p className="watch__text">{ep.text}</p>
          <p className="watch__meta">
            {formatTime(ep.duration)} min · {statusOf(ep)}
          </p>
          <Link href="/cadastro" className="btn btn--solid">
            Criar conta para assistir
          </Link>
        </div>
      </div>

      <div className="rowhead" data-reveal>
        <h3 className="rowhead__title">Continue assistindo</h3>
        <div className="rowhead__arrows">
          <button type="button" className="arrow" onClick={() => scrollRail(-1)} aria-label="Aulas anteriores">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="arrow" onClick={() => scrollRail(1)} aria-label="Próximas aulas">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="rail" ref={rail} data-reveal>
        {EPISODES.map((e, i) => {
          const done = e.watched >= e.duration;
          const p = Math.round((e.watched / e.duration) * 100);
          return (
            <button
              type="button"
              key={e.id}
              className="ecard"
              data-active={i === active}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
            >
              <span className="thumb ecard__thumb">
                <Thumb episode={e} sizes="300px" />
                <span className="ecard__time">{formatTime(e.duration)}</span>
                {done ? (
                  <span className="ecard__done" aria-label="Concluída">
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                ) : null}
                {p > 0 ? (
                  <span className="ecard__progress">
                    <span style={{ width: `${p}%` }} />
                  </span>
                ) : null}
              </span>
              <span className="ecard__title">{e.title}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
