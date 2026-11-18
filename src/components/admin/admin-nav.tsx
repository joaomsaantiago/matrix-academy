"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";

const svg = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const LINKS = [
  {
    href: "/admin",
    label: "Visão geral",
    icon: (
      <svg {...svg}>
        <path d="M4 13h6V4H4zM14 20h6V4h-6zM4 20h6v-4H4z" />
      </svg>
    ),
  },
  {
    href: "/admin/modulos",
    label: "Módulos e aulas",
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
    href: "/admin/alunos",
    label: "Alunos",
    icon: (
      <svg {...svg}>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.3a6.5 6.5 0 0 1 3.5 5.7" />
      </svg>
    ),
  },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <aside className="adm-nav" aria-label="Menu do painel">
      <Link href="/admin" className="adm-nav__brand">
        Matrix Academy
        <span>painel</span>
      </Link>

      <nav className="adm-nav__list">
        {LINKS.map((l) => {
          const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className="adm-nav__item"
              aria-current={active ? "page" : undefined}
            >
              {l.icon}
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="adm-nav__bottom">
        <Link href="/membros" className="adm-nav__item">
          <svg {...svg}>
            <path d="M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10" />
          </svg>
          Área de membros
        </Link>
        <form action={signOut}>
          <button type="submit" className="adm-nav__item">
            <svg {...svg}>
              <path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10M15 8l4 4-4 4M19 12H9" />
            </svg>
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
