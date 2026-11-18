import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { getStudent } from "@/lib/admin/data";
import { PROFESSIONS } from "@/lib/professions";
import { formatDuration, uuidSchema } from "@/lib/validation";

export const metadata: Metadata = { title: "Aluno" };

function dateTimeBR(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function phoneBR(digits: string) {
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return digits;
}

export default async function StudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const id = uuidSchema.safeParse((await params).id);
  if (!id.success) notFound();
  const s = await getStudent(supabase, id.data);
  if (!s) notFound();

  const { profile } = s;
  const total = s.modules.reduce((sum, m) => sum + m.episodes.length, 0);
  const done = s.modules.reduce((sum, m) => sum + m.completed, 0);
  const percent = total ? Math.round((done / total) * 100) : 0;
  const info: [string, React.ReactNode][] = [
    ["E-mail", profile.email],
    ["Telefone", phoneBR(profile.phone)],
    ["Profissão", profile.profession ? ((PROFESSIONS as Record<string, string>)[profile.profession] ?? profile.profession) : "—"],
    ["Tem a mesa Matrix?", profile.has_matrix === null ? "—" : profile.has_matrix ? "Sim" : "Não"],
    ["Cadastro", dateTimeBR(profile.created_at)],
    ["Última atividade", s.lastActivity ? dateTimeBR(s.lastActivity) : "Ainda não assistiu"],
    ["Certificado", s.certificate ? `${s.certificate.code} (${dateTimeBR(s.certificate.issued_at)})` : "Não emitido"],
  ];

  return (
    <>
      <header className="adm-head">
        <p className="adm-crumb">
          <Link href="/admin/alunos">Alunos</Link> / {profile.full_name}
        </p>
        <h1>
          {profile.full_name}
          {s.isAdmin ? <span className="adm-badge adm-badge--admin">admin</span> : null}
        </h1>
      </header>

      <section className="adm-panel" aria-labelledby="dados">
        <h2 id="dados">Dados do aluno</h2>
        <dl className="adm-dl">
          {info.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="adm-panel adm-panel--spaced" aria-labelledby="progresso">
        <div className="adm-head adm-head--row adm-head--tight">
          <h2 id="progresso">Progresso no curso</h2>
          <p className="adm-muted">
            {done} de {total} aulas ({percent}%)
          </p>
        </div>
        {s.modules.length === 0 ? (
          <p className="adm-empty">Ainda não há módulos publicados.</p>
        ) : (
          <ul className="adm-modules">
            {s.modules.map((m) => (
              <li key={m.id}>
                <div className="adm-modules__head">
                  <b>
                    Módulo {m.position} · {m.title}
                  </b>
                  <span className="adm-muted">
                    {m.completed} de {m.episodes.length}
                  </span>
                </div>
                {m.episodes.length === 0 ? (
                  <p className="adm-muted">Sem aulas publicadas.</p>
                ) : (
                  <ul className="adm-eps">
                    {m.episodes.map((e) => (
                      <li key={e.id} data-done={e.completed ? "1" : undefined}>
                        <span className="adm-eps__mark" aria-hidden="true">
                          {e.completed ? "✓" : ""}
                        </span>
                        <span className="adm-eps__title">
                          {e.position}. {e.title}
                        </span>
                        <span className="adm-muted">
                          {e.completed
                            ? "Concluída"
                            : e.seconds > 0
                              ? `Parou em ${formatDuration(e.seconds)}`
                              : "Não iniciada"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
