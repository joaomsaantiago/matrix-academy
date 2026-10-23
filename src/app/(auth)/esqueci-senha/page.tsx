import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/signin-form";

export const metadata: Metadata = { title: "Recuperar senha" };

/** A janela "esqueci minha senha" aberta por cima da tela de entrar (link direto, ex.: de um e-mail). */
export default function EsqueciSenhaPage() {
  return (
    <AuthShell
      title="Entrar na sua conta"
      intro="Continue de onde parou."
      footer={
        <>
          Ainda não tem conta? <Link href="/cadastro">Cadastre-se grátis</Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <SignInForm forgotRoute />
      </Suspense>
    </AuthShell>
  );
}
