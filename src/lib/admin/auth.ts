import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "student" | "admin";

/** Papel de quem está logado, lido do banco (nunca do navegador). null = sem login. */
export const getCurrentRole = cache(async (): Promise<{ userId: string; role: Role } | null> => {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  return { userId: auth.user.id, role: data?.role === "admin" ? "admin" : "student" };
});

/**
 * Porta de entrada do painel. Use no topo de TODA página e TODA ação do admin:
 * a verificação não pode depender só do layout. Sem login vai para /entrar; aluno comum recebe
 * 404 (o painel nem aparece para ele). As regras do banco (RLS) continuam valendo por baixo.
 */
export async function requireAdmin() {
  const current = await getCurrentRole();
  if (!current) redirect("/entrar");
  if (current.role !== "admin") notFound();
  const supabase = await createClient();
  return { supabase, userId: current.userId };
}
