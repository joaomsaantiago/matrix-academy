"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "@/app/(auth)/actions";

type Item = {
  label: string;
  icon: React.ReactNode;
  href?: string;
  /** botões que ainda vão ganhar uma tela */
  soon?: boolean;
};

const svg = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ITEMS: Item[] = [
  {
    label: "Início",
    href: "/membros",
    icon: (
      <svg {...svg}>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 10v9.5h13V10" />
      </svg>
    ),
  },
  {
    label: "Módulos",
    soon: true,
    icon: (
      <svg {...svg}>
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "Meu progresso",
    soon: true,
    icon: (
      <svg {...svg}>
        <path d="M5 20V11M12 20V5M19 20v-6" />
      </svg>
    ),
  },
  {
    label: "Certificado",
    soon: true,
    icon: (
      <svg {...svg}>
        <circle cx="12" cy="9" r="5" />
        <path d="m9 13.5-1.5 7L12 18l4.5 2.5-1.5-7" />
      </svg>
    ),
  },
];

/**
 * Menu lateral estilo streaming: fechado, só os ícones; ao clicar em qualquer ícone (ou no avatar)
 * abre por cima do conteúdo, com os nomes. Esc, clique fora ou no avatar fecham.
 */
export function MemberNav({
  name,
  email,
  initials,
}: {
  name: string;
  email: string;
  initials: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // fechado, qualquer clique num botão só abre o menu
  const guard = (e: React.MouseEvent) => {
    if (!open) {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <>
      <div className="mnav__scrim" data-open={open} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside ref={root} className="mnav" data-open={open} aria-label="Menu da área de membros">
        <button
          type="button"
          className="mnav__user"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          <span className="mnav__avatar" aria-hidden="true">
            {initials}
          </span>
          <span className="mnav__who">
            <b>{name}</b>
            <i>{email}</i>
          </span>
        </button>

        <nav className="mnav__list">
          {ITEMS.map((item) => {
            const content = (
              <>
                <span className="mnav__icon">{item.icon}</span>
                <span className="mnav__label">{item.label}</span>
                {item.soon ? <span className="mnav__soon">em breve</span> : null}
              </>
            );
            if (item.soon) {
              return (
                <button
                  key={item.label}
                  type="button"
                  className="mnav__item"
                  aria-disabled="true"
                  title={open ? undefined : item.label}
                  onClick={() => {
                    if (!open) setOpen(true);
                  }}
                >
                  {content}
                </button>
              );
            }
            return (
              <a
                key={item.label}
                href={item.href}
                className="mnav__item"
                aria-current="page"
                title={open ? undefined : item.label}
                onClick={(e) => {
                  guard(e);
                  if (open) setOpen(false);
                }}
              >
                {content}
              </a>
            );
          })}
        </nav>

        <form action={signOut} className="mnav__bottom">
          <button
            type="submit"
            className="mnav__item"
            title={open ? undefined : "Sair"}
            onClick={(e) => {
              if (!open) {
                e.preventDefault();
                setOpen(true);
              }
            }}
          >
            <span className="mnav__icon">
              <svg {...svg}>
                <path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" />
                <path d="M15 8l4 4-4 4M19 12H9" />
              </svg>
            </span>
            <span className="mnav__label">Sair</span>
          </button>
        </form>
      </aside>
    </>
  );
}
