import type { Metadata } from "next";
import { ModuleForm } from "@/components/admin/admin-forms";
import { requireAdmin } from "@/lib/admin/auth";
import { nextPosition } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Novo módulo" };

export default async function NewModulePage() {
  const { supabase } = await requireAdmin();
  const position = await nextPosition(supabase, "modules");
  return (
    <>
      <header className="adm-head">
        <h1>Novo módulo</h1>
        <p>Depois de criar, você poderá adicionar as aulas.</p>
      </header>
      <ModuleForm defaultPosition={position} />
    </>
  );
}
