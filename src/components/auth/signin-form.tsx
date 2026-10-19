"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type FormState } from "@/app/(auth)/actions";
import { Field, FormMessage, SubmitButton } from "./form-parts";

export function SignInForm({ linkError }: { linkError?: boolean }) {
  const [state, action] = useActionState<FormState, FormData>(signIn, {});

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <FormMessage
        error={
          state.error ??
          (linkError
            ? "Esse link expirou ou já foi usado. Entre com sua senha ou peça um novo link."
            : undefined)
        }
      />
      <Field
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
      />
      <Field
        label="Senha"
        name="password"
        type="password"
        autoComplete="current-password"
        error={state.fieldErrors?.password}
      />
      <SubmitButton>Entrar</SubmitButton>
      <Link
        href="/esqueci-senha"
        className="w-fit text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
      >
        Esqueci minha senha
      </Link>
    </form>
  );
}
