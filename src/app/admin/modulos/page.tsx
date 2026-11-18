import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { listModules } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Módulos e aulas" };

export default async function ModulesPage() {
  const { supabase } = await requireAdmin();
  const modules = await listModules(supabase);

  return (
    <>
      <header className="adm-head adm-head--row">
        <div>
          <h1>Módulos e aulas</h1>
          <p>Crie e edite o conteúdo do curso. Só o que está publicado aparece para os alunos.</p>
        </div>
        <Link href="/admin/modulos/novo" className="adm-btn adm-btn--primary">
          Novo módulo
        </Link>
      </header>

      {modules.length === 0 ? (
        <p className="adm-empty">Ainda não há módulos. Crie o primeiro.</p>
      ) : (
        <div className="adm-tablewrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Título</th>
                <th scope="col">Aulas</th>
                <th scope="col">Estado</th>
                <th scope="col">
                  <span className="adm-sr">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.id}>
                  <td className="adm-num">{m.position}</td>
                  <td>
                    <Link href={`/admin/modulos/${m.id}`} className="adm-strong">
                      {m.title}
                    </Link>
                  </td>
                  <td>
                    {m.episodes.total}
                    {m.episodes.total ? ` (${m.episodes.published} publicadas)` : ""}
                  </td>
                  <td>
                    <span className={`adm-badge ${m.published ? "adm-badge--ok" : ""}`}>
                      {m.published ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="adm-right">
                    <Link href={`/admin/modulos/${m.id}`} className="adm-btn adm-btn--small">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
