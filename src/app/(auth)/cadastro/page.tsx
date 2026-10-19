import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Criar conta" };

export default function CadastroPage() {
  return (
    <AuthShell
      title="Crie sua conta gratuita"
      intro="Acesso a todos os módulos, com certificado ao concluir."
      footer={
        <>
          Já tem conta?{" "}
          <Link href="/entrar" className="text-ink underline underline-offset-4">
            Entrar
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
