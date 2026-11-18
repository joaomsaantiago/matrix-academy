import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EpisodeForm } from "@/components/admin/admin-forms";
import { requireAdmin } from "@/lib/admin/auth";
import { getEpisode, getModule } from "@/lib/admin/data";
import { uuidSchema } from "@/lib/validation";

export const metadata: Metadata = { title: "Editar aula" };

export default async function EditEpisodePage({
  params,
}: {
  params: Promise<{ id: string; episodeId: string }>;
}) {
  const { supabase } = await requireAdmin();
  const p = await params;
  const moduleId = uuidSchema.safeParse(p.id);
  const episodeId = uuidSchema.safeParse(p.episodeId);
  if (!moduleId.success || !episodeId.success) notFound();

  const [mod, episode] = await Promise.all([
    getModule(supabase, moduleId.data),
    getEpisode(supabase, episodeId.data),
  ]);
  // a aula precisa pertencer ao módulo da URL
  if (!mod || !episode || episode.module_id !== mod.id) notFound();

  return (
    <>
      <header className="adm-head">
        <p className="adm-crumb">
          <Link href="/admin/modulos">Módulos</Link> / <Link href={`/admin/modulos/${mod.id}`}>{mod.title}</Link>
        </p>
        <h1>{episode.title}</h1>
      </header>
      <EpisodeForm moduleId={mod.id} episode={episode} defaultPosition={episode.position} />
    </>
  );
}
