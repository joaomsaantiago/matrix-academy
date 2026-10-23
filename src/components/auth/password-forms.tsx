"use client";

import { useActionState } from "react";
import {
  requestPasswordReset,
  resetPassword,
  type FormState,
} from "@/app/(auth)/actions";
import { Field, FormMessage, PasswordField, SubmitButton } from "./form-parts";

export function ForgotPasswordForm() {
  const [state, action] = useActionState<FormState, FormData>(
    requestPasswordReset,
    {},
  );

  if (state.message) {
    return <FormMessage message={state.message} />;
  }

  return (
    <form action={action} className="auth-form" noValidate>
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
    <form action={action} className="auth-form" noValidate>
      <FormMessage error={state.error} />
      <PasswordField
        label="Nova senha"
        autoComplete="new-password"
        error={state.fieldErrors?.password}
        hint="Mínimo de 8 caracteres."
      />
      <SubmitButton>Salvar nova senha</SubmitButton>
    </form>
  );
}
