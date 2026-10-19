"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Luz azul que acompanha o mouse dentro da capa. Escuta o ponteiro na própria seção
 * e move a luz com uma suavização, sem re-renderizar o React a cada movimento.
 */
export function HeroSpotlight() {
  const light = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = light.current;
    const hero = el?.closest<HTMLElement>(".hero");
    if (!el || !hero) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;
    let running = false;

    const place = () => {
      el.style.setProperty("--mx", `${current.x}px`);
      el.style.setProperty("--my", `${current.y}px`);
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.14;
      current.y += (target.y - current.y) * 0.14;
      place();
      if (Math.abs(target.x - current.x) > 0.4 || Math.abs(target.y - current.y) > 0.4) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      el.dataset.on = "1";
      if (reduced) {
        current.x = target.x;
        current.y = target.y;
        place();
        return;
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onLeave = () => {
      el.dataset.on = "0";
    };

    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={light} className="hero__spot" data-on="0" aria-hidden="true" />;
}

/**
 * Botão principal da capa. Ao clicar, o texto some, a seta volta para a esquerda
 * (a pílula encolhe até virar só o círculo) e então abre o cadastro.
 */
export function CreateAccountButton() {
  const router = useRouter();
  const [going, setGoing] = useState(false);

  // Se o navegador restaurar a página pelo botão "voltar", o botão volta ao normal.
  useEffect(() => {
    const reset = () => setGoing(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // deixa o navegador agir normalmente em Ctrl/Cmd/Shift+clique e botão do meio
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (going) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      router.push("/cadastro");
      return;
    }
    setGoing(true);
    window.setTimeout(() => router.push("/cadastro"), 650);
  };

  return (
    <a
      href="/cadastro"
      onClick={onClick}
      className={`pillbtn${going ? " is-going" : ""}`}
      aria-label="Criar conta grátis"
    >
      <span className="pillbtn__label">Criar conta grátis</span>
      <span className="pillbtn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}
