import type { SupabaseClient } from "@supabase/supabase-js";
import { EPISODES, MODULES } from "@/components/landing/data";

/** A aula em destaque da tela inicial: de onde o aluno parou ou a primeira do curso. */
export type Featured = {
  moduleNumber: number;
  moduleTitle: string;
  episodeNumber: number;
  episodeTitle: string;
  description: string;
  durationSeconds: number;
  /** onde o aluno parou (0 = ainda não começou) */
  resumeSeconds: number;
  /** true quando ainda não há aulas publicadas e mostramos um exemplo */
  isSample: boolean;
};

type EpisodeRow = {
  title: string;
  description: string | null;
  duration_seconds: number;
  position: number;
  modules: { title: string; position: number } | { title: string; position: number }[];
};

function one<T>(value: T | T[]): T {
  return Array.isArray(value) ? value[0] : value;
}

function fromRow(row: EpisodeRow, resumeSeconds: number): Featured {
  const mod = one(row.modules);
  return {
    moduleNumber: mod.position,
    moduleTitle: mod.title,
    episodeNumber: row.position,
    episodeTitle: row.title,
    description: row.description ?? "",
    durationSeconds: row.duration_seconds,
    resumeSeconds,
    isSample: false,
  };
}

const EPISODE_COLUMNS =
  "title, description, duration_seconds, position, modules!inner(title, position, published)";

export async function getFeatured(
  supabase: SupabaseClient,
  userId: string,
): Promise<Featured> {
  // 1) a aula que o aluno começou e não terminou, a mais recente
  const { data: resume } = await supabase
    .from("watch_progress")
    .select(`position_seconds, episodes!inner(${EPISODE_COLUMNS})`)
    .eq("user_id", userId)
    .eq("completed", false)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (resume) {
    const ep = one(resume.episodes as unknown as EpisodeRow | EpisodeRow[]);
    return fromRow(ep, resume.position_seconds);
  }

  // 2) a primeira aula publicada do primeiro módulo publicado
  const { data: first } = await supabase
    .from("episodes")
    .select(EPISODE_COLUMNS)
    .eq("published", true)
    .eq("modules.published", true)
    .order("modules(position)", { ascending: true })
    .order("position", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (first) return fromRow(first as unknown as EpisodeRow, 0);

  // 3) ainda não há aulas no banco: usa o exemplo da landing
  const sample = EPISODES[2];
  return {
    moduleNumber: sample.module + 1,
    moduleTitle: MODULES[sample.module].title,
    episodeNumber: 1,
    episodeTitle: sample.title,
    description: sample.text,
    durationSeconds: sample.duration,
    resumeSeconds: sample.watched,
    isSample: true,
  };
}
