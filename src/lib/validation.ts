import { z } from "zod";

/** Remove tudo que nao for digito. */
export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

/** Telefone brasileiro com DDD: 10 (fixo) ou 11 (celular) digitos. */
export function isValidBrazilianPhone(value: string) {
  const digits = onlyDigits(value);
  if (!/^[1-9]{2}/.test(digits)) return false; // DDD valido: 11 a 99
  if (digits.length === 11) return digits[2] === "9";
  return digits.length === 10;
}

export const signUpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(5, "Informe seu nome completo.")
    .refine((v) => v.split(/\s+/).length >= 2, "Informe nome e sobrenome."),
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido."),
  phone: z
    .string()
    .refine(isValidBrazilianPhone, "Informe um telefone com DDD, ex.: (11) 98765-4321."),
  password: z.string().min(8, "A senha precisa ter ao menos 8 caracteres."),
});

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido."),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "A senha precisa ter ao menos 8 caracteres."),
});
