"use client";

import { useFormStatus } from "react-dom";

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
}: {
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
}) {
  const id = `field-${name}`;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
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
        className="h-14 w-full rounded-full bg-surface px-6 text-base text-ink placeholder:text-ink-soft/70 aria-invalid:bg-danger/10"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-14 w-full rounded-full bg-ink px-6 text-base font-semibold text-ground transition hover:-translate-y-0.5 active:translate-y-px disabled:opacity-60"
    >
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
      <p role="alert" className="rounded-3xl bg-danger/10 px-5 py-3 text-sm text-danger">
        {error}
      </p>
    );
  }
  if (message) {
    return (
      <p role="status" className="rounded-3xl bg-ok/10 px-5 py-3 text-sm text-ok">
        {message}
      </p>
    );
  }
  return null;
}
