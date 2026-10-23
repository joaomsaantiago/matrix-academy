"use client";

import { useActionState, useState } from "react";
import { signUp, type FormState } from "@/app/(auth)/actions";
import { Field, FormMessage, PasswordField, SubmitButton } from "./form-parts";
import { ProfessionSelect } from "./profession-select";

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

  const hasMatrixError = state.fieldErrors?.hasMatrix;

  return (
    <form action={action} className="auth-form" noValidate>
      <FormMessage error={state.error} />

      <div className="auth-grid2">
        <ProfessionSelect
          defaultValue={state.values?.profession}
          error={state.fieldErrors?.profession}
        />
        <fieldset
          className="auth-choice"
          aria-describedby={hasMatrixError ? "field-hasMatrix-error" : undefined}
        >
          <legend className="auth-label">Já possui a mesa Matrix?</legend>
          <div className="auth-choice__row">
            <label>
              <input
                type="radio"
                name="hasMatrix"
                value="sim"
                defaultChecked={state.values?.hasMatrix === "sim"}
              />
              Sim
            </label>
            <label>
              <input
                type="radio"
                name="hasMatrix"
                value="nao"
                defaultChecked={state.values?.hasMatrix === "nao"}
              />
              Não
            </label>
          </div>
          {hasMatrixError ? (
            <p id="field-hasMatrix-error" className="auth-error">
              {hasMatrixError}
            </p>
          ) : null}
        </fieldset>
      </div>

      <div className="auth-grid2">
        <Field
          label="Nome"
          name="firstName"
          autoComplete="given-name"
          defaultValue={state.values?.firstName}
          error={state.fieldErrors?.firstName}
        />
        <Field
          label="Sobrenome"
          name="lastName"
          autoComplete="family-name"
          defaultValue={state.values?.lastName}
          error={state.fieldErrors?.lastName}
        />
      </div>

      <div className="auth-grid2">
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
          <label htmlFor="field-phone" className="auth-label">
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
            className="auth-input"
          />
          {state.fieldErrors?.phone ? (
            <p id="field-phone-error" className="auth-error">
              {state.fieldErrors.phone}
            </p>
          ) : null}
        </div>
      </div>

      <PasswordField
        autoComplete="new-password"
        error={state.fieldErrors?.password}
        placeholder="Mínimo de 8 caracteres"
      />

      <SubmitButton>Criar conta grátis</SubmitButton>
    </form>
  );
}
