import { z } from "zod";
import { PROFESSIONS } from "./professions";

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
  firstName: z.string().trim().min(2, "Informe seu nome."),
  lastName: z.string().trim().min(2, "Informe seu sobrenome."),
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido."),
  phone: z
    .string()
    .refine(isValidBrazilianPhone, "Informe um telefone com DDD."),
  password: z.string().min(8, "A senha precisa ter ao menos 8 caracteres."),
  profession: z.enum(Object.keys(PROFESSIONS) as [keyof typeof PROFESSIONS], {
    message: "Escolha sua profissão.",
  }),
  hasMatrix: z.enum(["sim", "nao"], { message: "Escolha Sim ou Não." }),
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
