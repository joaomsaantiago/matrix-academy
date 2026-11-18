"use client";

import { useRef } from "react";

/** Lista de cards cuja borda acende perto do cursor: cada card recebe a posição do mouse (--mx/--my) relativa a ele. */
export function GlowList({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const list = ref.current;
    if (!list) return;
    for (const card of list.children) {
      const r = card.getBoundingClientRect();
      const el = card as HTMLElement;
      el.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(1)}px`);
      el.style.setProperty("--my", `${(e.clientY - r.top).toFixed(1)}px`);
      el.style.setProperty("--hue", String(200 + Math.round((e.clientX / window.innerWidth) * 40)));
    }
  };

  const onLeave = () => {
    const list = ref.current;
    if (!list) return;
    for (const card of list.children) {
      (card as HTMLElement).style.setProperty("--mx", "-999px");
      (card as HTMLElement).style.setProperty("--my", "-999px");
    }
  };

  return (
    <ul ref={ref} className={className} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </ul>
  );
}
