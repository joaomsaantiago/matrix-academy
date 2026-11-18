import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EpisodeForm } from "@/components/admin/admin-forms";
import { requireAdmin } from "@/lib/admin/auth";
import { getModule, nextPosition } from "@/lib/admin/data";
import { uuidSchema } from "@/lib/validation";

export const metadata: Metadata = { title: "Nova aula" };

export default async function NewEpisodePage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const id = uuidSchema.safeParse((await params).id);
  if (!id.success) notFound();
  const mod = await getModule(supabase, id.data);
  if (!mod) notFound();
  const position = await nextPosition(supabase, "episodes", mod.id);

  return (
    <>
      <header className="adm-head">
        <p className="adm-crumb">
          <Link href="/admin/modulos">Módulos</Link> / <Link href={`/admin/modulos/${mod.id}`}>{mod.title}</Link>
        </p>
        <h1>Nova aula</h1>
      </header>
      <EpisodeForm moduleId={mod.id} defaultPosition={position} />
    </>
  );
}
