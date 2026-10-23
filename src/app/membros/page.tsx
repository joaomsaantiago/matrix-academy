import type { Metadata } from "next";
import { Suspense } from "react";
import { Billboard } from "@/components/members/billboard";
import { ModuleCards } from "@/components/members/module-cards";
import { getFeatured } from "@/lib/featured";
import { getModules } from "@/lib/modules";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Início" };

async function Featured() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const featured = await getFeatured(supabase, auth.user!.id);
  return <Billboard featured={featured} />;
}

async function Modules() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { modules, isSample } = await getModules(supabase, auth.user!.id);
  return <ModuleCards modules={modules} isSample={isSample} />;
}

export default function MembrosPage() {
  return (
    <>
      <Suspense fallback={<section className="bb bb--loading" aria-busy="true" />}>
        <Featured />
      </Suspense>
      <Suspense fallback={null}>
        <Modules />
      </Suspense>
    </>
  );
}
