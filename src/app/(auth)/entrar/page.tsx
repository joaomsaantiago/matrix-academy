import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/signin-form";

export const metadata: Metadata = { title: "Entrar" };

async function SignInWithLinkError({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  return <SignInForm linkError={erro === "link"} />;
}

export default function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  return (
    <AuthShell
      title="Entrar na sua conta"
      intro="Continue de onde parou."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link href="/cadastro">
            Cadastre-se grátis
          </Link>
        </>
      }
    >
      <Suspense fallback={<SignInForm />}>
        <SignInWithLinkError searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}
