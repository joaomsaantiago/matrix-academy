"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import {
  episodeSchema,
  moduleSchema,
  parseDuration,
  slugify,
  uuidSchema,
} from "@/lib/validation";

export type AdminFormState = {
  error?: string;
  message?: string;
  fieldErrors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
};

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function fieldErrorsOf(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

/** Erros do Postgres que sabemos explicar ao admin. */
function explain(error: { code?: string; message?: string; details?: string }) {
  if (error.code === "23505") {
    const text = `${error.message ?? ""} ${error.details ?? ""}`;
    if (/position/.test(text)) {
      return { fieldErrors: { position: "Já existe um item nessa posição. Escolha outra." } };
    }
    return { fieldErrors: { slug: "Já existe um item com esse endereço (slug). Escolha outro." } };
  }
  if (error.code === "42501") {
    return { error: "Sem permissão para esta alteração." };
  }
  return { error: "Não foi possível salvar agora. Tente novamente." };
}

function refresh(moduleId?: string) {
  revalidatePath("/admin", "layout");
  revalidatePath("/membros");
  if (moduleId) revalidatePath(`/admin/modulos/${moduleId}`);
}

export async function saveModule(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  // sempre a primeira linha: nenhuma ação do painel roda sem conferir o papel no servidor
  const { supabase } = await requireAdmin();

  const idRaw = str(formData, "id");
  const id = idRaw ? uuidSchema.safeParse(idRaw) : null;
  if (idRaw && !id?.success) return { error: "Módulo inválido." };

  const raw = {
    title: str(formData, "title"),
    slug: str(formData, "slug"),
    description: str(formData, "description"),
    thumbnail_url: str(formData, "thumbnail_url"),
    position: str(formData, "position"),
    published: formData.get("published") === "on",
  };
  const values: Record<string, string> = {
    title: raw.title,
    slug: raw.slug,
    description: raw.description,
    thumbnail_url: raw.thumbnail_url,
    position: raw.position,
    published: raw.published ? "on" : "",
  };

  const parsed = moduleSchema.safeParse(raw);
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error.issues), values };

  const d = parsed.data;
  const row = {
    title: d.title,
    slug: d.slug || slugify(d.title),
    description: d.description || null,
    thumbnail_url: d.thumbnail_url || null,
    position: d.position,
    published: d.published,
  };
  if (!row.slug) return { fieldErrors: { slug: "Não deu para gerar o endereço. Preencha." }, values };

  if (id?.success) {
    const { error } = await supabase.from("modules").update(row).eq("id", id.data);
    if (error) return { ...explain(error), values };
    refresh(id.data);
    return { message: "Módulo salvo.", values };
  }

  const { data, error } = await supabase.from("modules").insert(row).select("id").single();
  if (error || !data) return { ...explain(error ?? {}), values };
  refresh(data.id);
  redirect(`/admin/modulos/${data.id}`);
}

export async function saveEpisode(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();

  const moduleId = uuidSchema.safeParse(str(formData, "module_id"));
  if (!moduleId.success) return { error: "Módulo inválido." };
  const idRaw = str(formData, "id");
  const id = idRaw ? uuidSchema.safeParse(idRaw) : null;
  if (idRaw && !id?.success) return { error: "Aula inválida." };

  const raw = {
    title: str(formData, "title"),
    slug: str(formData, "slug"),
    description: str(formData, "description"),
    thumbnail_url: str(formData, "thumbnail_url"),
    bunny_video_id: str(formData, "bunny_video_id"),
    duration: str(formData, "duration"),
    position: str(formData, "position"),
    published: formData.get("published") === "on",
  };
  const values: Record<string, string> = {
    ...Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, String(v)])),
    published: raw.published ? "on" : "",
  };

  const parsed = episodeSchema.safeParse(raw);
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error.issues), values };

  const d = parsed.data;
  const row = {
    module_id: moduleId.data,
    title: d.title,
    slug: d.slug || slugify(d.title),
    description: d.description || null,
    thumbnail_url: d.thumbnail_url || null,
    bunny_video_id: d.bunny_video_id || null,
    duration_seconds: parseDuration(d.duration) ?? 0,
    position: d.position,
    published: d.published,
  };
  if (!row.slug) return { fieldErrors: { slug: "Não deu para gerar o endereço. Preencha." }, values };

  if (id?.success) {
    // module_id não muda numa edição
    const { module_id: _ignored, ...changes } = row;
    const { error } = await supabase
      .from("episodes")
      .update(changes)
      .eq("id", id.data)
      .eq("module_id", moduleId.data);
    if (error) return { ...explain(error), values };
    refresh(moduleId.data);
    return { message: "Aula salva.", values };
  }

  const { data, error } = await supabase.from("episodes").insert(row).select("id").single();
  if (error || !data) return { ...explain(error ?? {}), values };
  refresh(moduleId.data);
  redirect(`/admin/modulos/${moduleId.data}/aulas/${data.id}`);
}
