import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/password-forms";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Nova senha" };

async function ResetFormIfSignedIn() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/entrar?erro=link");
  return <ResetPasswordForm />;
}

export default function RedefinirSenhaPage() {
  return (
    <AuthShell title="Crie uma nova senha">
      <Suspense fallback={null}>
        <ResetFormIfSignedIn />
      </Suspense>
    </AuthShell>
  );
}
