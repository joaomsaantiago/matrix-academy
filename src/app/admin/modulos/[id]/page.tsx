import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ModuleForm } from "@/components/admin/admin-forms";
import { requireAdmin } from "@/lib/admin/auth";
import { getModule, listEpisodes } from "@/lib/admin/data";
import { formatDuration, uuidSchema } from "@/lib/validation";

export const metadata: Metadata = { title: "Editar módulo" };

export default async function EditModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const id = uuidSchema.safeParse((await params).id);
  if (!id.success) notFound();

  const mod = await getModule(supabase, id.data);
  if (!mod) notFound();
  const episodes = await listEpisodes(supabase, mod.id);

  return (
    <>
      <header className="adm-head">
        <p className="adm-crumb">
          <Link href="/admin/modulos">Módulos</Link> / Módulo {mod.position}
        </p>
        <h1>{mod.title}</h1>
      </header>

      <ModuleForm module={mod} defaultPosition={mod.position} />

      <section className="adm-panel adm-panel--spaced" aria-labelledby="aulas">
        <div className="adm-head adm-head--row adm-head--tight">
          <h2 id="aulas">Aulas do módulo</h2>
          <Link href={`/admin/modulos/${mod.id}/aulas/nova`} className="adm-btn adm-btn--primary">
            Nova aula
          </Link>
        </div>

        {episodes.length === 0 ? (
          <p className="adm-empty">Este módulo ainda não tem aulas.</p>
        ) : (
          <div className="adm-tablewrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Título</th>
                  <th scope="col">Duração</th>
                  <th scope="col">Vídeo</th>
                  <th scope="col">Estado</th>
                  <th scope="col">
                    <span className="adm-sr">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {episodes.map((e) => (
                  <tr key={e.id}>
                    <td className="adm-num">{e.position}</td>
                    <td>
                      <Link href={`/admin/modulos/${mod.id}/aulas/${e.id}`} className="adm-strong">
                        {e.title}
                      </Link>
                    </td>
                    <td>{e.duration_seconds ? formatDuration(e.duration_seconds) : "—"}</td>
                    <td>{e.bunny_video_id ? "Sim" : <span className="adm-muted">Sem vídeo</span>}</td>
                    <td>
                      <span className={`adm-badge ${e.published ? "adm-badge--ok" : ""}`}>
                        {e.published ? "Publicada" : "Rascunho"}
                      </span>
                    </td>
                    <td className="adm-right">
                      <Link
                        href={`/admin/modulos/${mod.id}/aulas/${e.id}`}
                        className="adm-btn adm-btn--small"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
