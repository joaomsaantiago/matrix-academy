import type { Metadata } from "next";
import { Suspense } from "react";
import { Billboard } from "@/components/members/billboard";
import { getFeatured } from "@/lib/featured";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Início" };

async function Featured() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const featured = await getFeatured(supabase, auth.user!.id);
  return <Billboard featured={featured} />;
}

export default function MembrosPage() {
  return (
    <Suspense fallback={<section className="bb bb--loading" aria-busy="true" />}>
      <Featured />
    </Suspense>
  );
}
