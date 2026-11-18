import type { SupabaseClient } from "@supabase/supabase-js";

/* Consultas do painel. Todas rodam com a sessão do admin: as políticas do banco (RLS) decidem o que
   volta, então um aluno que chegasse aqui não receberia nada. Cada função devolve só o necessário. */

export type AdminModule = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  position: number;
  published: boolean;
};

export type AdminEpisode = {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  bunny_video_id: string | null;
  duration_seconds: number;
  position: number;
  published: boolean;
};

export type StudentRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  profession: string | null;
  has_matrix: boolean | null;
  created_at: string;
  completed: number;
  isAdmin: boolean;
};

const MODULE_COLUMNS = "id, slug, title, description, thumbnail_url, position, published";
const EPISODE_COLUMNS =
  "id, module_id, slug, title, description, thumbnail_url, bunny_video_id, duration_seconds, position, published";

export async function getOverview(supabase: SupabaseClient) {
  const count = async (table: string, filter?: (q: any) => any) => {
    let q = supabase.from(table).select("id", { count: "exact", head: true });
    if (filter) q = filter(q);
    const { count: n } = await q;
    return n ?? 0;
  };
  const [students, modules, publishedModules, episodes, publishedEpisodes, certificates] =
    await Promise.all([
      count("profiles"),
      count("modules"),
      count("modules", (q) => q.eq("published", true)),
      count("episodes"),
      count("episodes", (q) => q.eq("published", true)),
      supabase.from("certificates").select("id", { count: "exact", head: true }).then((r) => r.count ?? 0),
    ]);
  const { data: latest } = await supabase
    .from("profiles")
    .select("id, full_name, email, created_at")
    .order("created_at", { ascending: false })
    .limit(5);
  return { students, modules, publishedModules, episodes, publishedEpisodes, certificates, latest: latest ?? [] };
}

export async function listModules(supabase: SupabaseClient) {
  const { data: modules } = await supabase
    .from("modules")
    .select(MODULE_COLUMNS)
    .order("position", { ascending: true });
  const { data: episodes } = await supabase.from("episodes").select("module_id, published");
  const totals = new Map<string, { total: number; published: number }>();
  for (const e of episodes ?? []) {
    const t = totals.get(e.module_id) ?? { total: 0, published: 0 };
    t.total += 1;
    if (e.published) t.published += 1;
    totals.set(e.module_id, t);
  }
  return ((modules ?? []) as AdminModule[]).map((m) => ({
    ...m,
    episodes: totals.get(m.id) ?? { total: 0, published: 0 },
  }));
}

export async function getModule(supabase: SupabaseClient, id: string) {
  const { data } = await supabase.from("modules").select(MODULE_COLUMNS).eq("id", id).maybeSingle();
  return (data as AdminModule | null) ?? null;
}

export async function listEpisodes(supabase: SupabaseClient, moduleId: string) {
  const { data } = await supabase
    .from("episodes")
    .select(EPISODE_COLUMNS)
    .eq("module_id", moduleId)
    .order("position", { ascending: true });
  return (data ?? []) as AdminEpisode[];
}

export async function getEpisode(supabase: SupabaseClient, id: string) {
  const { data } = await supabase.from("episodes").select(EPISODE_COLUMNS).eq("id", id).maybeSingle();
  return (data as AdminEpisode | null) ?? null;
}

/** Próxima posição livre numa tabela (módulos, ou aulas de um módulo). */
export async function nextPosition(
  supabase: SupabaseClient,
  table: "modules" | "episodes",
  moduleId?: string,
) {
  let q = supabase.from(table).select("position").order("position", { ascending: false }).limit(1);
  if (table === "episodes" && moduleId) q = q.eq("module_id", moduleId);
  const { data } = await q;
  return (data?.[0]?.position ?? 0) + 1;
}

/** Tira caracteres que têm significado nos filtros do PostgREST (vírgula, parênteses, %, *, \). */
function safeSearch(q: string) {
  return q.replace(/[,()%*\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
}

export async function listStudents(supabase: SupabaseClient, query = ""): Promise<StudentRow[]> {
  let q = supabase
    .from("profiles")
    .select("id, full_name, email, phone, profession, has_matrix, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  const term = safeSearch(query);
  if (term) q = q.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
  const { data: profiles } = await q;
  const rows = profiles ?? [];
  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.id);
  const [{ data: done }, { data: roles }] = await Promise.all([
    supabase.from("watch_progress").select("user_id").eq("completed", true).in("user_id", ids),
    supabase.from("user_roles").select("user_id, role").in("user_id", ids),
  ]);
  const completed = new Map<string, number>();
  for (const d of done ?? []) completed.set(d.user_id, (completed.get(d.user_id) ?? 0) + 1);
  const admins = new Set((roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id));

  return rows.map((r) => ({
    ...r,
    completed: completed.get(r.id) ?? 0,
    isAdmin: admins.has(r.id),
  }));
}

export async function countPublishedEpisodes(supabase: SupabaseClient) {
  const { count } = await supabase
    .from("episodes")
    .select("id, modules!inner(published)", { count: "exact", head: true })
    .eq("published", true)
    .eq("modules.published", true);
  return count ?? 0;
}

export async function getStudent(supabase: SupabaseClient, id: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, profession, has_matrix, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!profile) return null;

  const [{ data: role }, { data: cert }, { data: progress }, { data: modules }] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", id).maybeSingle(),
    supabase.from("certificates").select("code, issued_at").eq("user_id", id).maybeSingle(),
    supabase
      .from("watch_progress")
      .select("episode_id, position_seconds, completed, updated_at")
      .eq("user_id", id),
    supabase
      .from("modules")
      .select("id, title, position, episodes(id, title, position, published, duration_seconds)")
      .order("position", { ascending: true }),
  ]);

  const byEpisode = new Map((progress ?? []).map((p) => [p.episode_id, p]));
  const lastActivity = (progress ?? []).reduce<string | null>(
    (latest, p) => (!latest || p.updated_at > latest ? p.updated_at : latest),
    null,
  );

  type Ep = { id: string; title: string; position: number; published: boolean; duration_seconds: number };
  const modulesView = (modules ?? []).map((m) => {
    const eps = ((m.episodes ?? []) as Ep[])
      .filter((e) => e.published)
      .sort((a, b) => a.position - b.position)
      .map((e) => {
        const p = byEpisode.get(e.id);
        return {
          id: e.id,
          title: e.title,
          position: e.position,
          duration: e.duration_seconds,
          seconds: p?.position_seconds ?? 0,
          completed: p?.completed ?? false,
        };
      });
    return {
      id: m.id,
      title: m.title,
      position: m.position,
      episodes: eps,
      completed: eps.filter((e) => e.completed).length,
    };
  });

  return {
    profile,
    isAdmin: role?.role === "admin",
    certificate: cert ?? null,
    lastActivity,
    modules: modulesView,
  };
}
