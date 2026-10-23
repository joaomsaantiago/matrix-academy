"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { signIn, type FormState } from "@/app/(auth)/actions";
import { ForgotDialog } from "./forgot-dialog";
import { Field, FormMessage, PasswordField, SubmitButton } from "./form-parts";

export function SignInForm({
  linkError,
  forgotRoute,
}: {
  linkError?: boolean;
  /** true na rota /esqueci-senha: a janela abre já aberta e, ao fechar, volta para /entrar */
  forgotRoute?: boolean;
}) {
  const router = useRouter();
  const [forgotOpen, setForgotOpen] = useState(!!forgotRoute);
  const [state, action] = useActionState<FormState, FormData>(signIn, {});

  return (
    <>
      <form action={action} className="auth-form" noValidate>
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
        <PasswordField
          autoComplete="current-password"
          error={state.fieldErrors?.password}
        />
        <SubmitButton>Entrar</SubmitButton>
        <button
          type="button"
          className="auth-link"
          onClick={() => setForgotOpen(true)}
        >
          Esqueci minha senha
        </button>
      </form>
      <ForgotDialog
        open={forgotOpen}
        onClose={() => {
          setForgotOpen(false);
          if (forgotRoute) router.replace("/entrar");
        }}
      />
    </>
  );
}
