"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  hint?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

function Help({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error) {
    return (
      <p id={`${id}-error`} className="auth-error">
        {error}
      </p>
    );
  }
  return hint ? (
    <p id={`${id}-hint`} className="auth-hint">
      {hint}
    </p>
  ) : null;
}

export function Field({
  label,
  name,
  type = "text",
  autoComplete,
  defaultValue,
  error,
  hint,
  inputMode,
  placeholder,
  onChange,
}: FieldProps) {
  const id = `field-${name}`;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={onChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="auth-input"
      />
      <Help id={id} error={error} hint={hint} />
    </div>
  );
}

/** Campo de senha com o botão de mostrar/ocultar. */
export function PasswordField({
  label = "Senha",
  name = "password",
  autoComplete,
  error,
  hint,
  placeholder,
}: {
  label?: string;
  name?: string;
  autoComplete?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  const id = `field-${name}`;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <div className="auth-pass">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="auth-input"
        />
        <button
          type="button"
          className="auth-eye"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={show}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {show ? (
              <>
                <path d="M9.9 5.1A9.7 9.7 0 0 1 12 5c5 0 8.5 4.2 9.5 7a11.7 11.7 0 0 1-2.4 3.8M6.6 6.6C4.4 8 2.9 10.2 2.5 12c1 2.8 4.5 7 9.5 7 1.7 0 3.2-.5 4.5-1.2" />
                <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" />
              </>
            ) : (
              <>
                <path d="M2.5 12C3.5 9.2 7 5 12 5s8.5 4.2 9.5 7c-1 2.8-4.5 7-9.5 7s-8.5-4.2-9.5-7Z" />
                <circle cx="12" cy="12" r="3" />
              </>
            )}
          </svg>
        </button>
      </div>
      <Help id={id} error={error} hint={hint} />
    </div>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="auth-submit">
      {pending ? "Aguarde…" : children}
    </button>
  );
}

export function FormMessage({
  error,
  message,
}: {
  error?: string;
  message?: string;
}) {
  if (error) {
    return (
      <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">
        {error}
      </p>
    );
  }
  if (message) {
    return (
      <p role="status" className="rounded-2xl bg-ok/10 px-4 py-3 text-sm text-ok">
        {message}
      </p>
    );
  }
  return null;
}
