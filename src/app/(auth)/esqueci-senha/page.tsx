import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/password-forms";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function EsqueciSenhaPage() {
  return (
    <AuthShell
      title="Recuperar senha"
      intro="Informe seu e-mail e enviaremos um link para criar uma nova senha."
      footer={
        <Link href="/entrar" className="text-ink underline underline-offset-4">
          Voltar para entrar
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
