"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { MODULES, TOTAL_LESSONS } from "./data";

/** Tempo de cada passo (o cartão troca ao fim). */
const CYCLE_MS = 4500;
/** A barra chega ao fim do trecho (33%, 66%, 100%) nesse tempo e fica parada até o próximo passo. */
const FILL_MS = 500;

const STEPS = [
  {
    name: "Passo 1",
    title: "Crie sua conta",
    text: "Cadastro gratuito, só com nome, e-mail e senha. Sem cartão e sem pegadinha.",
  },
  {
    name: "Passo 2",
    title: "Assista às aulas",
    text: `${MODULES.length} módulos em vídeo, no seu ritmo e no horário que quiser. O progresso fica salvo e você continua de onde parou.`,
  },
  {
    name: "Passo 3",
    title: "Receba o certificado",
    text: "Concluiu todos os módulos? O certificado sai na hora, com um código para qualquer pessoa conferir.",
  },
] as const;

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/** Cartão com um passo por vez: gira sozinho, para ao passar o mouse e aceita clique nas pílulas. */
export function StepsCard() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const stepRef = useRef(0);
  const elapsed = useRef(0);
  const shown = useRef<number | null>(null);
  stepRef.current = step;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = card.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // progresso geral. O alvo da barra é o fim do trecho do passo atual (33%, 66%, 100%), alcançado em
  // FILL_MS depois que o passo aparece (ou na hora, se a pessoa clicou no passo); a barra desliza até
  // o alvo e fica parada. O tempo só corre fora da pausa; a troca automática de passo é em CYCLE_MS.
  useEffect(() => {
    const targetPct = () => {
      const t = Math.min(1, elapsed.current / FILL_MS);
      const frac = 1 - (1 - t) * (1 - t); // desacelera ao chegar
      const target = ((stepRef.current + frac) * 100) / STEPS.length;
      return target;
    };
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(100, now - last) : 0;
      last = now;
      if (!reduced && !paused && visible) {
        elapsed.current += dt;
        if (elapsed.current >= CYCLE_MS) {
          elapsed.current = 0;
          setStep((s) => (s + 1) % STEPS.length);
        }
      }
      const target = targetPct();
      // a barra desliza até o alvo (também quando a pessoa clica num passo com o mouse parado)
      const prev = shown.current ?? target;
      let next = prev + (target - prev) * (reduced ? 1 : 1 - Math.exp(-dt / 90));
      if (Math.abs(target - next) < 0.05) next = target;
      shown.current = next;
      if (fill.current) fill.current.style.transform = `scaleX(${next / 100})`;
      if (label.current) label.current.textContent = `${Math.floor(next + 0.001)}%`;
    };
    if (reduced) elapsed.current = FILL_MS; // sem animação: a barra mostra o fim do trecho do passo
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, visible, reduced, step]);

  const choose = (i: number) => {
    // a barra vai direto ao fim do trecho escolhido: passo 1 = 33%, passo 2 = 66%, passo 3 = 100%
    elapsed.current = FILL_MS;
    stepRef.current = i;
    setStep(i);
  };

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const current = STEPS[step];

  return (
    <div
      ref={card}
      className="stepsc"
      onMouseMove={onMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <nav className="stepsc__nav" aria-label="Passos">
        <ol>
          {STEPS.map((s, i) => {
            const state = i < step ? "done" : i === step ? "now" : "next";
            return (
              <li key={s.name}>
                <button
                  type="button"
                  className={`stepsc__pill is-${state}`}
                  aria-current={i === step ? "step" : undefined}
                  onClick={() => choose(i)}
                >
                  <span className="stepsc__dot">{state === "done" ? <Check /> : i + 1}</span>
                  {s.name}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="stepsc__stage" aria-live="polite">
        <div className="stepsc__copy" key={`copy-${step}`}>
          <h3>{current.title}</h3>
          <p>{current.text}</p>
        </div>

        <div className="stepsc__art" key={`art-${step}`}>
          {step === 0 && (
            <>
              <div className="sc-panel sc-form sc-in-left">
                <span className="sc-label">Criar conta</span>
                <span className="sc-field">Nome completo</span>
                <span className="sc-field">E-mail</span>
                <span className="sc-field">Senha</span>
                <Link href="/cadastro" className="sc-btn">
                  Criar conta grátis
                </Link>
              </div>
              <div className="sc-panel sc-toast sc-in-right" aria-hidden="true">
                <span className="sc-ok">
                  <Check />
                </span>
                <span>
                  <b>Conta criada</b>
                  <i>Bem-vindo à Matrix Academy</i>
                </span>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div className="sc-panel sc-player sc-in-scale" aria-hidden="true">
                <div className="sc-screen">
                  <span className="sc-play" />
                </div>
                <span className="sc-bar">
                  <span />
                </span>
                <span className="sc-meta">
                  <b>Módulo 3 · Aula 2</b>
                  <i>{TOTAL_LESSONS} aulas no total</i>
                </span>
              </div>
              <div className="sc-panel sc-resume sc-in-scale sc-late" aria-hidden="true">
                <span className="sc-chip">Continuar de onde parou</span>
                <span className="sc-bar sc-bar--thin">
                  <span />
                </span>
              </div>
            </>
          )}
          {step === 2 && (
            <div className="sc-panel sc-cert sc-in-scale" aria-hidden="true">
              <span className="sc-seal" />
              <span className="sc-cert-title">Certificado de conclusão</span>
              <span className="sc-cert-name">Seu nome aqui</span>
              <span className="sc-cert-line" />
              <span className="sc-cert-code">Código MX-2026-0001</span>
            </div>
          )}
        </div>
      </div>

      <div className="stepsc__meter">
        <div
          className="stepsc__bar"
          role="progressbar"
          aria-label="Progresso dos passos"
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span ref={fill} />
        </div>
        <span ref={label} className="stepsc__pct" aria-hidden="true">
          0%
        </span>
      </div>
    </div>
  );
}
