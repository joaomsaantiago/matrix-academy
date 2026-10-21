"use client";

import { useEffect, useRef } from "react";

const DOT_SMOOTHNESS = 0.2;
const BORDER_SMOOTHNESS = 0.1;
const INTERACTIVE = "a, button, img, input, textarea, select, [role='button']";

/**
 * Cursor com ponto e anel que seguem o mouse com atraso suave. O anel cresce sobre
 * elementos clicáveis. Só aparece em dispositivos com mouse (não em telas de toque).
 * A posição é escrita direto no DOM a cada quadro, sem re-renderizar o React.
 */
export const Component = () => {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!dotEl || !ringEl) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0, y: 0 };
    const dotPos = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };
    let raf = 0;
    let started = false;

    const place = () => {
      dotEl.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      ringEl.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
    };

    const animate = () => {
      const kd = reduced ? 1 : DOT_SMOOTHNESS;
      const kr = reduced ? 1 : BORDER_SMOOTHNESS;
      dotPos.x += (mouse.x - dotPos.x) * kd;
      dotPos.y += (mouse.y - dotPos.y) * kd;
      ringPos.x += (mouse.x - ringPos.x) * kr;
      ringPos.y += (mouse.y - ringPos.y) * kr;
      place();
      raf = requestAnimationFrame(animate);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!started) {
        // primeiro movimento: nasce já na posição do mouse, sem "voar" desde o canto
        started = true;
        dotPos.x = ringPos.x = mouse.x;
        dotPos.y = ringPos.y = mouse.y;
        place();
        dotEl.style.opacity = ringEl.style.opacity = "1";
        raf = requestAnimationFrame(animate);
      }
    };

    // delegação: vale também para elementos criados depois (rotas, menus, etc.)
    const onOver = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest?.(INTERACTIVE);
      ringEl.dataset.hover = hit ? "1" : "0";
    };
    const onLeaveWindow = () => {
      dotEl.style.opacity = ringEl.style.opacity = "0";
      started = false;
      cancelAnimationFrame(raf);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] mix-blend-difference" aria-hidden="true">
      <div
        ref={dot}
        className="absolute left-0 top-0 size-2 rounded-full bg-white opacity-0 transition-opacity duration-300"
      />
      <div
        ref={ring}
        data-hover="0"
        className="absolute left-0 top-0 size-7 rounded-full border border-white opacity-0 transition-[width,height,opacity] duration-300 data-[hover='1']:size-11"
      />
    </div>
  );
};
