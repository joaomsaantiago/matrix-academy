import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Criar conta" };

export default function CadastroPage() {
  return (
    <AuthCard
      title="Crie sua conta gratuita"
      intro="Acesso a todos os módulos, com certificado ao concluir."
      footer={
        <>
          Já tem conta?{" "}
          <Link href="/entrar">
            Entrar
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}
