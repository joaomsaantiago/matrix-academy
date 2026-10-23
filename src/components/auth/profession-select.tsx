"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { PROFESSIONS } from "@/lib/professions";

type Key = keyof typeof PROFESSIONS;
const KEYS = Object.keys(PROFESSIONS) as Key[];

const svg = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Um ícone para cada profissão. */
function Icon({ name }: { name: Key }) {
  if (name === "pastor") {
    // cruz
    return (
      <svg {...svg}>
        <path d="M12 3v18M7 8h10" />
      </svg>
    );
  }
  if (name === "tecnico_som") {
    // faders de mesa de som
    return (
      <svg {...svg}>
        <path d="M6 4v16M12 4v16M18 4v16" />
        <rect x="4" y="13" width="4" height="3" rx="1" fill="currentColor" />
        <rect x="10" y="7" width="4" height="3" rx="1" fill="currentColor" />
        <rect x="16" y="10" width="4" height="3" rx="1" fill="currentColor" />
      </svg>
    );
  }
  // locador: caixa de som
  return (
    <svg {...svg}>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <circle cx="12" cy="15" r="3" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * Lista de profissões com ícones (combobox acessível): setas, Enter, Espaço, Esc, Home e End
 * funcionam. O valor escolhido vai num campo oculto, então o formulário continua igual.
 */
export function ProfessionSelect({
  defaultValue,
  error,
}: {
  defaultValue?: string;
  error?: string;
}) {
  const id = useId();
  const [value, setValue] = useState<Key | "">(
    KEYS.includes(defaultValue as Key) ? (defaultValue as Key) : "",
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, value ? KEYS.indexOf(value) : 0));
    setOpen(true);
  };
  const choose = (k: Key) => {
    setValue(k);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openList();
        else setActive((a) => Math.min(KEYS.length - 1, a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openList();
        else setActive((a) => Math.max(0, a - 1));
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActive(KEYS.length - 1);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(KEYS[active]);
        else openList();
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  const listId = `${id}-list`;
  return (
    <div ref={root} className="auth-combo">
      <span id={`${id}-label`} className="auth-label">
        Profissão
      </span>
      <input type="hidden" name="profession" value={value} />
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-activedescendant={open ? `${id}-o${active}` : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="auth-input auth-combo__btn"
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span id={`${id}-value`} className={value ? "auth-combo__value" : "auth-combo__ph"}>
          {value ? (
            <>
              <Icon name={value} />
              {PROFESSIONS[value]}
            </>
          ) : (
            "Selecione"
          )}
        </span>
        <svg {...svg} className="auth-combo__chev">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul id={listId} role="listbox" aria-labelledby={`${id}-label`} className="auth-combo__list">
          {KEYS.map((k, i) => (
            <li
              key={k}
              id={`${id}-o${i}`}
              role="option"
              aria-selected={value === k}
              data-active={i === active ? "1" : undefined}
              className="auth-combo__opt"
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(k)}
            >
              <Icon name={k} />
              <span>{PROFESSIONS[k]}</span>
              {value === k ? (
                <svg {...svg} strokeWidth={2.4} className="auth-combo__check">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="auth-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
