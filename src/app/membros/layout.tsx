import { Suspense } from "react";
import { MemberNav } from "@/components/members/member-nav";
import { createClient } from "@/lib/supabase/server";
import "./members.css";

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

async function NavLoader() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", auth.user!.id)
    .single();
  const name = profile?.full_name ?? "Aluno";
  return (
    <MemberNav name={name} email={auth.user?.email ?? ""} initials={initialsOf(name)} />
  );
}

export default function MembrosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="members">
      <Suspense fallback={<aside className="mnav" aria-hidden="true" />}>
        <NavLoader />
      </Suspense>
      <div className="members__main">{children}</div>
    </div>
  );
}
