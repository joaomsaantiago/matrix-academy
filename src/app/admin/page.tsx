import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { getOverview } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Visão geral" };

function dateBR(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function AdminHome() {
  const { supabase } = await requireAdmin();
  const o = await getOverview(supabase);

  const cards = [
    { label: "Alunos", value: o.students, href: "/admin/alunos" },
    { label: "Módulos", value: o.modules, note: `${o.publishedModules} publicados`, href: "/admin/modulos" },
    { label: "Aulas", value: o.episodes, note: `${o.publishedEpisodes} publicadas`, href: "/admin/modulos" },
    { label: "Certificados emitidos", value: o.certificates },
  ];

  return (
    <>
      <header className="adm-head">
        <h1>Visão geral</h1>
        <p>Resumo do curso e dos alunos.</p>
      </header>

      <ul className="adm-stats">
        {cards.map((c) => (
          <li key={c.label} className="adm-card">
            <span className="adm-card__label">{c.label}</span>
            <b className="adm-card__value">{c.value}</b>
            {c.note ? <span className="adm-card__note">{c.note}</span> : null}
            {c.href ? (
              <Link href={c.href} className="adm-card__link">
                Abrir
              </Link>
            ) : null}
          </li>
        ))}
      </ul>

      <section className="adm-panel" aria-labelledby="latest">
        <h2 id="latest">Últimos cadastros</h2>
        {o.latest.length === 0 ? (
          <p className="adm-muted">Nenhum aluno cadastrado ainda.</p>
        ) : (
          <ul className="adm-list">
            {o.latest.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/alunos/${s.id}`}>
                  <span>
                    <b>{s.full_name}</b>
                    <i>{s.email}</i>
                  </span>
                  <time dateTime={s.created_at}>{dateBR(s.created_at)}</time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
