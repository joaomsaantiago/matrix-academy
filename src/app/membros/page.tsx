import type { Metadata } from "next";
import { Suspense } from "react";
import { signOut } from "@/app/(auth)/actions";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Área de membros" };

async function MemberSummary() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", auth.user!.id)
    .single();

  const { data: progress } = await supabase
    .from("my_course_progress")
    .select("total_episodes, completed_episodes, percent")
    .single();

  const firstName = profile?.full_name?.split(" ")[0] ?? "aluno";

  return (
    <>
      <div className="flex items-start justify-between gap-6">
        <h1 className="text-4xl font-semibold leading-tight tracking-tight">
          Olá, {firstName}.
        </h1>
        <form action={signOut}>
          <button className="text-sm text-ink-soft underline underline-offset-4 hover:text-ink">
            Sair
          </button>
        </form>
      </div>
      <p className="mt-4 text-ink-soft">
        Seu progresso no curso: {progress?.completed_episodes ?? 0} de{" "}
        {progress?.total_episodes ?? 0} episódios ({progress?.percent ?? 0}%).
      </p>
    </>
  );
}

export default function MembrosPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Suspense fallback={<p className="text-ink-soft">Carregando…</p>}>
        <MemberSummary />
      </Suspense>
      <p className="mt-8 text-ink-soft">
        Os módulos e o player entram na próxima fase.
      </p>
    </main>
  );
}
