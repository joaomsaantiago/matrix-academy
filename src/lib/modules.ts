import type { SupabaseClient } from "@supabase/supabase-js";
import { MODULES } from "@/components/landing/data";

/** Um módulo do curso na tela de membros, com o progresso do aluno logado. */
export type ModuleCard = {
  number: number;
  title: string;
  description: string;
  lessons: number;
  completed: number;
  /** foto da mesa e o recorte (zoom) usados na capa do cartão */
  photo: string;
  focus: { x: number; y: number; zoom: number };
};

type Row = {
  title: string;
  description: string | null;
  position: number;
  episodes: { id: string; published: boolean }[];
};

/** Os módulos publicados, em ordem. Sem módulos no banco, mostra os 8 do exemplo da landing. */
export async function getModules(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ modules: ModuleCard[]; isSample: boolean }> {
  const { data } = await supabase
    .from("modules")
    .select("title, description, position, episodes(id, published)")
    .eq("published", true)
    .order("position", { ascending: true });

  const rows = (data ?? []) as unknown as Row[];
  if (rows.length === 0) {
    return {
      isSample: true,
      modules: MODULES.map((m, i) => ({
        number: i + 1,
        title: m.title,
        description: m.text,
        lessons: m.lessons,
        completed: 0,
        photo: m.photo,
        focus: m.focus,
      })),
    };
  }

  const { data: done } = await supabase
    .from("watch_progress")
    .select("episode_id")
    .eq("user_id", userId)
    .eq("completed", true);
  const doneIds = new Set((done ?? []).map((d) => d.episode_id as string));

  return {
    isSample: false,
    modules: rows.map((row, i) => {
      const eps = row.episodes.filter((e) => e.published);
      // a foto da mesa segue a ordem dos módulos de exemplo até haver capas próprias
      const art = MODULES[i % MODULES.length];
      return {
        number: row.position,
        title: row.title,
        description: row.description ?? "",
        lessons: eps.length,
        completed: eps.filter((e) => doneIds.has(e.id)).length,
        photo: art.photo,
        focus: art.focus,
      };
    }),
  };
}
