"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  onlyDigits,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validation";

export type FormState = {
  error?: string;
  message?: string;
  fieldErrors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
};

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function fieldErrorsOf(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

async function siteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function signUp(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    fullName: str(formData, "fullName"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    password: str(formData, "password"),
  };
  // nunca devolvemos a senha para o navegador
  const values = { fullName: raw.fullName, email: raw.email, phone: raw.phone };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error.issues), values };
  }

  const { fullName, email, phone, password } = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone: onlyDigits(phone) },
      emailRedirectTo: `${await siteUrl()}/auth/callback?next=/membros`,
    },
  });

  if (error) {
    const alreadyUsed = /already|registered|exists/i.test(error.message);
    return {
      error: alreadyUsed
        ? "Este e-mail já tem cadastro. Tente entrar."
        : "Não foi possível criar a conta agora. Tente novamente em instantes.",
      values,
    };
  }

  // Supabase devolve um usuario sem identidades quando o e-mail ja existe
  // (protecao contra enumeracao de contas).
  if (data.user && data.user.identities?.length === 0) {
    return { error: "Este e-mail já tem cadastro. Tente entrar.", values };
  }

  // Com confirmacao de e-mail ligada nao ha sessao ainda.
  if (!data.session) {
    return {
      message: `Enviamos um link de confirmação para ${email}. Abra o e-mail para ativar sua conta.`,
    };
  }

  redirect("/membros");
}

export async function signIn(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = { email: str(formData, "email"), password: str(formData, "password") };
  const values = { email: raw.email };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error.issues), values };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    const unconfirmed = /not confirmed/i.test(error.message);
    return {
      error: unconfirmed
        ? "Confirme seu e-mail antes de entrar. Procure o link na sua caixa de entrada."
        : "E-mail ou senha incorretos.",
      values,
    };
  }

  redirect("/membros");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordReset(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = { email: str(formData, "email") };
  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error.issues), values: raw };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${await siteUrl()}/auth/callback?next=/redefinir-senha`,
  });

  // Mesma resposta exista a conta ou nao.
  return {
    message:
      "Se este e-mail tem cadastro, você vai receber um link para criar uma nova senha.",
  };
}

export async function resetPassword(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = resetPasswordSchema.safeParse({
    password: str(formData, "password"),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error.issues) };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return {
      error: "O link expirou. Peça um novo em “Esqueci minha senha”.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return { error: "Não foi possível salvar a nova senha. Tente novamente." };
  }

  redirect("/membros");
}
