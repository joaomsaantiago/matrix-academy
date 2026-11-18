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

/* ---------- painel de admin ---------- */

/** "meu-modulo": minúsculas, números e hífens. */
export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** "12:30" ou "1:02:30" -> segundos. Vazio vale 0. Devolve null se o formato for inválido. */
export function parseDuration(value: string): number | null {
  const v = value.trim();
  if (v === "") return 0;
  if (!/^\d{1,3}(:\d{1,2}){0,2}$/.test(v)) return null;
  const parts = v.split(":").map(Number);
  if (parts.length > 1 && parts.slice(1).some((n) => n > 59)) return null;
  return parts.reduce((total, n) => total * 60 + n, 0);
}

/** 750 -> "12:30" */
export function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(h ? 2 : 1, "0");
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

const optionalSlug = z
  .string()
  .trim()
  .toLowerCase()
  .refine(
    (v) => v === "" || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v),
    "Use só letras minúsculas, números e hífens.",
  );

const optionalImage = z
  .string()
  .trim()
  .max(500, "Endereço muito longo.")
  .refine(
    (v) => v === "" || /^https:\/\/\S+$/.test(v) || /^\/[^\s/]\S*$/.test(v),
    "Use um endereço https:// ou um caminho como /img/capa.webp.",
  );

const positiveInt = (message: string) =>
  z
    .string()
    .trim()
    .regex(/^\d{1,4}$/, message)
    .transform(Number)
    .refine((n) => n >= 1, message);

export const moduleSchema = z.object({
  title: z.string().trim().min(2, "Informe o título.").max(120, "Máximo de 120 caracteres."),
  slug: optionalSlug,
  description: z.string().trim().max(2000, "Máximo de 2000 caracteres."),
  thumbnail_url: optionalImage,
  position: positiveInt("Informe a posição (1, 2, 3…)."),
  published: z.boolean(),
});

export const episodeSchema = z.object({
  title: z.string().trim().min(2, "Informe o título.").max(160, "Máximo de 160 caracteres."),
  slug: optionalSlug,
  description: z.string().trim().max(4000, "Máximo de 4000 caracteres."),
  thumbnail_url: optionalImage,
  bunny_video_id: z
    .string()
    .trim()
    .max(100, "ID muito longo.")
    .refine((v) => v === "" || /^[A-Za-z0-9_-]+$/.test(v), "Use só letras, números, hífen e _."),
  duration: z.string().refine((v) => parseDuration(v) !== null, "Use o formato mm:ss, ex.: 12:30."),
  position: positiveInt("Informe a posição (1, 2, 3…)."),
  published: z.boolean(),
});

export const uuidSchema = z.string().uuid();
