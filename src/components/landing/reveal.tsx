"use client";

import { useEffect, useRef } from "react";

/**
 * Entrada e saída em sequência: cada filho com data-reveal aparece (com 70ms entre um e outro)
 * quando entra na tela e sai de cena quando sai, para cima ou para baixo conforme o lado por
 * onde saiu. O data-reveal aceita "left", "right" e "rise" além do padrão (sobe).
 * Sem JavaScript, ou com movimento reduzido, tudo já aparece.
 */
export function Reveal({
  children,
  className = "",
  as: Tag = "div",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    items.forEach((el, i) => el.style.setProperty("--i", String(i)));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.remove("is-out-up", "is-out-down");
            el.classList.add("is-in");
          } else if (el.classList.contains("is-in")) {
            el.classList.remove("is-in");
            // saiu pelo topo (rolando para baixo) ou pela base (rolando para cima)
            el.classList.add(entry.boundingClientRect.top < 0 ? "is-out-up" : "is-out-down");
          }
        });
      },
      { threshold: 0.1, rootMargin: "-4% 0px -8% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const Component = Tag as "div";
  return (
    <Component ref={ref} id={id} className={className}>
      {children}
    </Component>
  );
}
