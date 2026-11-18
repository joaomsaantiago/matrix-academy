import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { countPublishedEpisodes, listStudents } from "@/lib/admin/data";
import { PROFESSIONS } from "@/lib/professions";

export const metadata: Metadata = { title: "Alunos" };

function dateBR(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** (11) 98765-4321 a partir dos dígitos guardados. */
function phoneBR(digits: string) {
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return digits;
}

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const [students, totalEpisodes] = await Promise.all([
    listStudents(supabase, q),
    countPublishedEpisodes(supabase),
  ]);

  return (
    <>
      <header className="adm-head adm-head--row">
        <div>
          <h1>Alunos</h1>
          <p>
            {students.length} {students.length === 1 ? "aluno" : "alunos"}
            {q ? ` para “${q}”` : ""}
            {students.length === 500 ? " (mostrando os 500 mais recentes)" : ""}.
          </p>
        </div>
        <form className="adm-search" role="search" action="/admin/alunos">
          <label className="adm-sr" htmlFor="q">
            Buscar por nome ou e-mail
          </label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Buscar por nome ou e-mail" className="adm-input" />
          <button type="submit" className="adm-btn">
            Buscar
          </button>
        </form>
      </header>

      {students.length === 0 ? (
        <p className="adm-empty">{q ? "Nenhum aluno encontrado." : "Nenhum aluno cadastrado ainda."}</p>
      ) : (
        <div className="adm-tablewrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th scope="col">Aluno</th>
                <th scope="col">Telefone</th>
                <th scope="col">Profissão</th>
                <th scope="col">Tem a mesa?</th>
                <th scope="col">Progresso</th>
                <th scope="col">Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const percent = totalEpisodes ? Math.min(100, Math.round((s.completed / totalEpisodes) * 100)) : 0;
                return (
                  <tr key={s.id}>
                    <td>
                      <Link href={`/admin/alunos/${s.id}`} className="adm-strong">
                        {s.full_name}
                      </Link>
                      {s.isAdmin ? <span className="adm-badge adm-badge--admin">admin</span> : null}
                      <span className="adm-sub">{s.email}</span>
                    </td>
                    <td>{phoneBR(s.phone)}</td>
                    <td>{s.profession ? (PROFESSIONS as Record<string, string>)[s.profession] ?? s.profession : "—"}</td>
                    <td>{s.has_matrix === null ? "—" : s.has_matrix ? "Sim" : "Não"}</td>
                    <td>
                      <span className="adm-progress" aria-label={`${percent}% do curso`}>
                        <span style={{ width: `${percent}%` }} />
                      </span>
                      <span className="adm-sub">
                        {s.completed} de {totalEpisodes} aulas
                      </span>
                    </td>
                    <td>{dateBR(s.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
