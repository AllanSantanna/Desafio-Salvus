import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres"),

  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido"),

  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido"),

  password: z
    .string()
    .min(1, "A senha é obrigatória"),
});
