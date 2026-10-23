"use client";

import { useEffect, useRef, useState } from "react";
import type { Featured } from "@/lib/featured";

/** Vídeo de apresentação enquanto as aulas reais (Bunny Stream) não estão ligadas. */
const PREVIEW_VIDEO = "/videopronto.mp4";
const POSTER = "/hero-frames/f0300.webp";

function minutes(seconds: number) {
  const m = Math.max(1, Math.round(seconds / 60));
  return `${m} min`;
}
function clock(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Destaque da tela inicial, no estilo dos serviços de streaming: o vídeo da aula rodando ao fundo
 * (sem som), com módulo, título e descrição por cima. O botão principal liga o som e toca a aula.
 */
export function Billboard({ featured }: { featured: Featured }) {
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    v.play().catch(() => setPlaying(false));
  }, []);

  const hasResume = featured.resumeSeconds > 0 && !featured.isSample;
  const percent = featured.durationSeconds
    ? Math.min(100, (featured.resumeSeconds / featured.durationSeconds) * 100)
    : 0;

  const onPrimary = () => {
    const v = video.current;
    if (!v) return;
    if (!started) {
      setStarted(true);
      setMuted(false);
      v.muted = false;
      // retoma de onde parou, se o vídeo for maior que essa posição
      if (featured.resumeSeconds > 0 && featured.resumeSeconds < (v.duration || 0)) {
        v.currentTime = featured.resumeSeconds;
      } else {
        v.currentTime = 0;
      }
      v.loop = false;
      v.play().catch(() => undefined);
      return;
    }
    if (v.paused) void v.play();
    else v.pause();
  };

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const label = !started ? (hasResume ? "Continuar" : "Assistir") : playing ? "Pausar" : "Reproduzir";

  return (
    <section className="bb" aria-labelledby="bb-title">
      <div className="bb__media">
        {!failed ? (
          <video
            ref={video}
            className="bb__video"
            src={PREVIEW_VIDEO}
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setStarted(false)}
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="bb__poster" style={{ backgroundImage: `url(${POSTER})` }} />
        )}
        <div className="bb__shade" aria-hidden="true" />
      </div>

      <div className="bb__content">
        <p className="bb__kicker">
          Módulo {featured.moduleNumber} <span aria-hidden="true">·</span> Aula {featured.episodeNumber}
        </p>
        <p className="bb__module">{featured.moduleTitle}</p>
        <h1 id="bb-title" className="bb__title">
          {featured.episodeTitle}
        </h1>
        {featured.description ? <p className="bb__desc">{featured.description}</p> : null}

        <div className="bb__meta">
          <span>{minutes(featured.durationSeconds)}</span>
          {hasResume ? (
            <span className="bb__resume">
              <span className="bb__bar" aria-hidden="true">
                <span style={{ width: `${percent}%` }} />
              </span>
              Você parou em {clock(featured.resumeSeconds)}
            </span>
          ) : (
            <span>Primeira aula do curso</span>
          )}
        </div>

        <div className="bb__actions">
          <button type="button" className="bb__play" onClick={onPrimary}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {started && playing ? (
                <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
              ) : (
                <path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.4-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5Z" fill="currentColor" />
              )}
            </svg>
            {label}
          </button>
        </div>
      </div>

      <button
        type="button"
        className="bb__sound"
        onClick={toggleSound}
        aria-label={muted ? "Ligar o som" : "Desligar o som"}
        aria-pressed={!muted}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
          {muted ? <path d="m16 9.5 5 5m0-5-5 5" /> : <path d="M16 9a4.5 4.5 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />}
        </svg>
      </button>

      {featured.isSample ? (
        <p className="bb__note">Exemplo: as aulas reais entram quando forem publicadas.</p>
      ) : null}
    </section>
  );
}
