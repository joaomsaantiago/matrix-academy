"use client";

import { useEffect, useRef } from "react";

/**
 * Entrada em sequência: cada filho com data-reveal sobe e aparece, com 70ms entre um e outro,
 * quando a seção entra na tela. Sem JavaScript, ou com movimento reduzido, tudo já aparece.
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
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
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
