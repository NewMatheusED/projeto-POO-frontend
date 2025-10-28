import { z } from "zod";


export interface IBaseUsuario {
  name: string;
}

export interface IUsuario extends IBaseUsuario {
  email: string;
}

const BaseUserSchema = z.object({
  name: z
    .string()
    .regex(
      /^[a-zA-Z0-9-\s]{3,20}$/,
      "O nome deve ter entre 3 e 20 caracteres e conter apenas letras, números, espaços ou -."
    )
    .refine((value) => !/^\d+$/.test(value), {
      message: "O nome não pode ser apenas números.",
    })
    .min(3, "Nome precisa ter 3 caracteres")
    .max(20, "Nome não pode ter mais de 20 caracteres"),
}) satisfies z.ZodType<IBaseUsuario>;

const NewUser: IBaseUsuario = {
  name: "a123456789",
};

export const UsuarioTeste = BaseUserSchema.parse(NewUser);
export const UserSchema = BaseUserSchema.extend({
  email: z.email("Email inválido"),
}) satisfies z.ZodType<IUsuario>;
