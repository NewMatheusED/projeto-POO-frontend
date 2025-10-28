import { useReducer, useState } from "react";
import { Form, Link } from "react-router";
import { z } from "zod";
import Logo from "~/src/components/Logo";
import { Fields } from "~/src/components/utils/_fields";
import {
  type UserLoginForm,
  UserLoginFormSchema,
} from "../../typing";

function FormHelpNavigation() {
  return (
    <div className="flex flex-row gap-2 sm:flex-col sm:gap-0.5">
      <label className="text-ai-gray font-medium" htmlFor="">
        Sem conta?
      </label>
      <Link
        className="text-ai-neon-blue hover:text-ai-accent-cyan font-medium transition-colors"
        to={"/registro"}
      >
        Cadastre-se
      </Link>
    </div>
  );
}

export default function FormModal() {
  const [isSubmited, setIsSubmited] = useState(false);
  const [userInfo, setUserInfo] = useReducer(
    (state: UserLoginForm, action: Partial<UserLoginForm>) => {
      return { ...state, ...action };
    },
    { email: "", password: "" } as UserLoginForm
  );
  
  const parseUserResult = UserLoginFormSchema.safeParse(userInfo);
  const userFieldErrors = parseUserResult.success
    ? {
        properties: { email: { errors: [""] }, password: { errors: [""] } },
      }
    : z.treeifyError(parseUserResult.error);
  
  function HandleSubmit() {
    const isLoading = localStorage.getItem("loginLoading") == "true";
    if (isLoading) return false;
    
    if (!parseUserResult.success) {
      if (userInfo.password.length === 0) {
        return false;
      }
      const onlyPasswordError =
        !userFieldErrors.properties?.email?.errors?.[0] &&
        !!userFieldErrors.properties?.password?.errors?.[0];
      
      if (!onlyPasswordError) {
        return false;
      }
    }
    localStorage.setItem("loginLoading", "true");
    return true;
  }
  return (
    <div
      className="flex shadow-2xl shadow-ai-neon-blue/20 relative z-10 flex-col gap-4 bg-ai-dark-blue-card border border-ai-neon-blue/30 h-full w-[100%] mx-auto my-auto p-8 sm:h-[490px] sm:w-2/3 sm:max-w-[32rem] sm:rounded-4xl backdrop-blur-sm"
    >
      <div className="block sm:hidden">
        <Logo size="md" />
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-bold bg-gradient-to-r from-ai-neon-blue to-ai-accent-cyan bg-clip-text text-transparent">
          Bem vindo
        </h1>
        <div className="hidden flex-col gap-2 sm:flex">
          <FormHelpNavigation />
        </div>
      </div>
      <Form
        method="post"
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          const result = HandleSubmit();
          if (!result) {
            e.preventDefault();
            setIsSubmited(true);
            return;
          }
          setIsSubmited(false);
        }}
      >
        <Fields.wrapper>
          <Fields.label
            text="ENTRE COM SEU ENDEREÇO DE E-MAIL"
            tailWindClasses="!text-ai-gray"
          />
          <Fields.input
            type="text"
            name="email"
            placeholder="Email"
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo({ email: e.target.value as string })
            }
            error={
              userInfo.email.length > 0
                ? userFieldErrors.properties?.email?.errors?.[0]
                  ? {
                      message: userFieldErrors.properties.email.errors[0],
                      error: true,
                    }
                  : { message: "", error: false }
                : isSubmited
                  ? {
                      message: "Por favor, preencha o e-mail.",
                      error: true,
                    }
                  : { message: "", error: false }
            }
          />
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.label
            text="INSIRA SUA SENHA DE ACESSO"
            tailWindClasses="!text-ai-gray"
          />
          <Fields.input
            type="password"
            name="password"
            placeholder="Senha"
            value={userInfo.password}
            onChange={(e) =>
              setUserInfo({ password: e.target.value as string })
            }
            error={
              userInfo.password.length === 0 && isSubmited
                ? {
                    message: "Por favor, preencha a senha.",
                    error: true,
                  }
                : { message: "", error: false }
            }
          />
        </Fields.wrapper>
        <button
          className="w-fit text-ai-neon-blue hover:text-ai-accent-cyan font-medium transition-colors"
          type="button"
        >
          Esqueceu sua senha?
        </button>
        <div className="flex gap-2 sm:hidden">
          <FormHelpNavigation />
        </div>
        <button
          type="submit"
          className="p-2 rounded-2xl bg-gradient-to-r from-ai-neon-blue to-ai-accent-cyan text-ai-white hover:from-ai-neon-blue-bright hover:to-ai-accent-cyan font-bold transition-all duration-300 shadow-lg shadow-ai-neon-blue/50 hover:shadow-ai-neon-blue/70"
        >
          Entrar
        </button>
      </Form>
    </div>
  );
}
