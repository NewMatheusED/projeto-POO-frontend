import { useEffect, useReducer, useState } from "react";
import { Form, Link, useActionData } from "react-router";
import { z } from "zod";
import type { ApiResponse } from "~/features/apiClient/typings";
import { UserPasswordSchema } from "~/features/auth/typing";
import {
  UserSchema,
  type IUsuario,
} from "~/features/user/typings";
import { Fields } from "~/src/components/utils/_fields";
import type { InputError } from "~/src/components/utils/_fields/typings";
import type { clientAction } from "../route";
export default function FormModal() {
  const data = useActionData<typeof clientAction>() as ApiResponse | null;
  const [actionData, setActionData] = useReducer(
    (
      state: ApiResponse | null,
      action: ApiResponse | null
    ): ApiResponse | null => {
      if (!state) return action as ApiResponse;
      return { ...state, ...action };
    },
    data
  );
  useEffect(() => {
    setActionData(data);
  }, [data]);
  const [password, setPassword] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [UserInfo, setUserInfo] = useReducer(
    (state: IUsuario, action: Partial<IUsuario>) => {
      return { ...state, ...action };
    },
    {
      name: "",
      email: "",
    } as IUsuario
  );
  const parseUserResult = UserSchema.safeParse(UserInfo);
  const UserFieldErrors = parseUserResult.success
    ? {
        properties: {
          name: { errors: [""] },
          role: { errors: [""] },
          email: { errors: [""] },
        },
      }
    : z.treeifyError(parseUserResult.error);

  const ConfirmPasswordSchema = z.string().refine((pass) => pass === password, {
    message: "As senhas não coincidem",
  });
  const confirmPasswordResult =
    ConfirmPasswordSchema.safeParse(confirmPassword);
  const passwordResult = UserPasswordSchema.safeParse(password);
  const passwordError = passwordResult.success
    ? { errors: [] }
    : z.treeifyError(passwordResult.error);
  function HandleSubmit(): boolean {
    if (!UserSchema.safeParse(UserInfo).success) {
      console.log(UserSchema.safeParse(UserInfo));
      console.log("UserInfo invalido", UserInfo);
      return false;
    }
    if (!ConfirmPasswordSchema.safeParse(confirmPassword).success) {
      console.log("ConfirmPasswordSchema invalido", confirmPassword);
      return false;
    }
    if (!UserPasswordSchema.safeParse(password).success) {
      console.log("UserPasswordSchema invalido", password);
      return false;
    }
    return true;
  }

  function InputOnChange(name: string, value: string) {
    setActionData(
      data
        ? {
            ...data,
            error_fields: { ...data.error_fields, [name]: undefined },
          }
        : null
    );
    setUserInfo({ [name]: value as string });
  }

  function InputValidation(name: string): InputError {
    function ActionValidation(name: string): InputError {
      if (
        actionData?.error_fields?.[name] &&
        actionData.error_fields[name] != undefined
      ) {
        return {
          message: actionData.error_fields[name][0],
          error: true,
        };
      }
      return { message: "", error: false };
    }
    switch (name) {
      case "email":
        if (UserInfo.email.length > 0 || isSubmited) {
          if (UserFieldErrors.properties?.email?.errors?.[0]) {
            return {
              message: UserFieldErrors.properties.email.errors[0],
              error: true,
            };
          }
        }
        return ActionValidation(name);
      case "name":
        if (UserInfo.name.length > 0 || isSubmited) {
          if (UserFieldErrors.properties?.name?.errors?.[0]) {
            return {
              message: UserFieldErrors.properties.name.errors[0],
              error: true,
            };
          }
        }
        return ActionValidation(name);
      default:
        return ActionValidation(name);
    }
  }
  return (
    <Form
      method="post"
      onSubmit={(e) => {
        const result = HandleSubmit();
        if (!result) {
          e.preventDefault();
          setIsSubmited(true);
          return;
        }
        setIsSubmited(false);
      }}
      className="h-full overflow-y-auto shadow-lg/55 bg-beergam-white p-8 rounded-tl-none rounded-tr-none rounded-xl gap-4 flex flex-col lg:rounded-tl-2xl lg:rounded-br-none"
    >
      {/* <p>{JSON.stringify(actionData?.error_fields)}</p> */}
      <h1 className="text-beergam-blue-primary">Cadastre-se</h1>
      <div>
        <Fields.wrapper>
          <Fields.label text="DIGITE SEU ENDEREÇO DE E-MAIL" />
          <Fields.input
            type="text"
            name="email"
            placeholder="Email"
            value={UserInfo.email}
            onChange={(e) => InputOnChange("email", e.target.value)}
            error={InputValidation("email")}
          />
        </Fields.wrapper>
      </div>
      <div className={`fieldsContainer`}>
        <Fields.wrapper>
          <Fields.label text="NOME COMPLETO / RAZÃO SOCIAL"></Fields.label>
          <Fields.input
            name="name"
            placeholder="Nome Completo / Razão Social"
            value={UserInfo.name}
            onChange={(e) => InputOnChange("name", e.target.value)}
            error={
              UserInfo.name.length > 0 || isSubmited
                ? UserFieldErrors.properties?.name?.errors?.[0]
                  ? {
                      message: UserFieldErrors.properties.name.errors[0],
                      error: true,
                    }
                  : { message: "", error: false }
                : { message: "", error: false }
            }
          ></Fields.input>
        </Fields.wrapper>
      </div>
      <div className={`fieldsContainer`}>
        <Fields.wrapper>
          <Fields.label text="DIGITE SUA SENHA" />
          <Fields.input
            value={password}
            type="password"
            placeholder="Senha"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            error={
              password.length > 0 && passwordError.errors?.[0]
                ? { error: true, message: passwordError.errors?.[0] }
                : password.length == 0 && isSubmited
                  ? { error: true, message: "Por favor, preencha a senha" }
                  : { error: false, message: "" }
            }
          ></Fields.input>
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.label text="CONFIRME SUA SENHA" />
          <Fields.input
            value={confirmPassword}
            type="password"
            placeholder="Confirmar Senha"
            onChange={(e) => setConfirmPassword(e.target.value)}
            // error={
            //   (password.length > 0 || confirmPassword.length > 0) &&

            // }
            error={{
              message: confirmPasswordResult.success
                ? ""
                : "As senhas não coincidem",
              error: confirmPasswordResult.success ? false : true,
            }}
          ></Fields.input>
        </Fields.wrapper>
      </div>
      <button
        type="submit"
        className="p-2 rounded-2xl bg-beergam-orange text-beergam-white roundend hover:bg-beergam-blue-primary"
      >
        Criar conta grátis
      </button>
      <p className="text-beergam-gray text-center font-medium lg:text-left">
        Ao começar o teste gratuito, declaro que li e aceito os{" "}
        <Link
          to={"/termos-de-uso"}
          className="text-beergam-blue-primary hover:text-beergam-orange font-medium"
        >
          termos e condições de uso
        </Link>{" "}
        do sistema
      </p>
      <div className="flex flex-row gap-2">
        <label className="text-beergam-gray font-medium" htmlFor="">
          Já possui uma conta?
        </label>
        <Link
          className="text-beergam-blue-primary hover:text-beergam-orange font-medium"
          to={"/login"}
        >
          Acessar
        </Link>
      </div>
    </Form>
  );
}
