"use client";

import { useActionState } from "react";
import {
  requestPasswordReset,
  resetPassword,
  type FormState,
} from "@/app/(auth)/actions";
import { Field, FormMessage, SubmitButton } from "./form-parts";

export function ForgotPasswordForm() {
  const [state, action] = useActionState<FormState, FormData>(
    requestPasswordReset,
    {},
  );

  if (state.message) {
    return <FormMessage message={state.message} />;
  }

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <FormMessage error={state.error} />
      <Field
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
      />
      <SubmitButton>Enviar link</SubmitButton>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action] = useActionState<FormState, FormData>(
    resetPassword,
    {},
  );

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <FormMessage error={state.error} />
      <Field
        label="Nova senha"
        name="password"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.password}
        hint="Mínimo de 8 caracteres."
      />
      <SubmitButton>Salvar nova senha</SubmitButton>
    </form>
  );
}
