import { z } from "zod";

export interface UserLoginForm {
  email: string;
  password: string;
}

const UserEmailSchema = z.email("E-mail inválido.");
export const UserPasswordSchema = z
  .string()
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
  .regex(/\d/, "A senha deve conter pelo menos um número.")
  .regex(/[!@#$%^&*]/, "A senha deve conter pelo menos um caractere especial.")
  .refine(
    (pass) => pass.length >= 8,
    "A senha deve ter pelo menos 8 caracteres."
  );

export const UserLoginFormSchema = z.object({
  email: UserEmailSchema,
  password: UserPasswordSchema,
}) satisfies z.ZodType<UserLoginForm>;

// Schema para os dados retornados pelo login
export interface UserLoginResponse {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export const UserLoginResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  status: z.string(),
}) satisfies z.ZodType<UserLoginResponse>;
