"use client";

import { useActionState, useState } from "react";
import { signUp, type FormState } from "@/app/(auth)/actions";
import { Field, FormMessage, SubmitButton } from "./form-parts";

/** (11) 98765-4321 */
function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function SignUpForm() {
  const [state, action] = useActionState<FormState, FormData>(signUp, {});
  const [phone, setPhone] = useState(state.values?.phone ?? "");

  if (state.message) {
    return <FormMessage message={state.message} />;
  }

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <FormMessage error={state.error} />
      <Field
        label="Nome completo"
        name="fullName"
        autoComplete="name"
        defaultValue={state.values?.fullName}
        error={state.fieldErrors?.fullName}
        hint="Este nome aparece no seu certificado."
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
      <div>
        <label htmlFor="field-phone" className="mb-2 block text-sm font-medium">
          Telefone
        </label>
        <input
          id="field-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(11) 98765-4321"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          aria-invalid={state.fieldErrors?.phone ? true : undefined}
          aria-describedby={state.fieldErrors?.phone ? "field-phone-error" : undefined}
          className="h-14 w-full rounded-full bg-surface px-6 text-base text-ink placeholder:text-ink-soft/70 aria-invalid:bg-danger/10"
        />
        {state.fieldErrors?.phone ? (
          <p id="field-phone-error" className="mt-2 text-sm text-danger">
            {state.fieldErrors.phone}
          </p>
        ) : null}
      </div>
      <Field
        label="Senha"
        name="password"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.password}
        hint="Mínimo de 8 caracteres."
      />
      <SubmitButton>Criar minha conta</SubmitButton>
    </form>
  );
}
