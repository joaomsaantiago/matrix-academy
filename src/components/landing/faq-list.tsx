"use client";

import { useId, useState } from "react";

/** Acordeão de uma pergunta aberta por vez. A resposta desliza com a altura animada em grid. */
export function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <ul className="faqx__list">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panel = `${base}-p${i}`;
        return (
          <li key={item.q} className={`faqx__item${isOpen ? " is-open" : ""}`}>
            <h3>
              <button
                type="button"
                className="faqx__q"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>
            <div id={panel} role="region" className="faqx__a">
              <div>
                <p>{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
