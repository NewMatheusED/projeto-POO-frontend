import { redirect } from "react-router";
import { authService } from "~/features/auth/service";
import { UserSchema } from "~/features/user/typings";
// import { commitSession, getSession } from "~/sessions";
import { toast } from "react-hot-toast";
import { userCrypto } from "~/features/auth/utils";
import type { Route } from "./+types/route";
import LoginPage from "./page";
import { UserLoginResponseSchema, type UserLoginResponse } from "~/features/auth/typing";
// export async function loader({ request }: Route.LoaderArgs) {
//   const session = await getSession(request.headers.get("Cookie"));
//   const userInfo = session.get("userInfo") ?? null;
//   console.log("userInfo do route", userInfo, request);
//   return { userInfo: "jorge" };
// }

// export async function clientLoader({ request }: Route.ClientLoaderArgs) {
//   console.log("clientLoader do route", request);
//   return { userInfo: "jorge" };
// }

const errorResponse = {
  success: false,
  data: {} as UserLoginResponse,
  message:
    "Erro ao transformar informações do usuário. Tente novamente em alguns instantes.",
  error_code: 500,
  error_fields: {},
};

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const formInfo = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const responsePromise = authService
    .login(formInfo)
    .then((response) => {
      if (!response.success) {
        // Rejeita a Promise se o login falhar
        const errorObj = new Error(response.message || "Erro ao fazer login");
        Object.assign(errorObj, { ...response });
        throw errorObj;
      }
      return response;
    })
    .finally(() => {
      localStorage.setItem("loginLoading", "false");
    });

  toast.promise(responsePromise, {
    loading: "Carregando...",
    success: "Login realizado com sucesso",
    error: (err) => (
      <div>
        <p className="text-nowrap">{`${err.message || "Erro ao fazer login"}`}</p>
        <p>
          <u>Código: {err.error_code}</u>
        </p>
      </div>
    ),
  });

  // Use try/catch para lidar com a Promise rejeitada
  try {
    const response = await responsePromise;

    console.log("response do route", response);
    console.log("request do route", request);

    // Validar os dados de resposta do login
    const loginData = UserLoginResponseSchema.safeParse(response.data);
    if (!loginData.success) {
      console.log("dados de login inválidos", loginData);
      errorResponse.data = response.data;
      toast.error(
        "Erro ao transformar informações do usuário. Tente novamente em alguns instantes."
      );
      return Response.json(errorResponse);
    }
    
    // Criar um objeto de usuário básico com os dados disponíveis
    const userData = {
      name: loginData.data.name,
      email: loginData.data.email,
    };
    
    // Validar com o UserSchema (que espera um IBaseUsuario)
    const user = UserSchema.safeParse(userData);
    if (!user.success) {
      console.log("user invalido", user);
      toast.error(
        "Erro ao transformar informações do usuário. Tente novamente em alguns instantes."
      );
      return Response.json(errorResponse);
    }
    await userCrypto.encriptarDadosUsuario(user.data);
    // session.set("userInfo", user.data);

    return redirect("/interno", {
      // headers: {
      //   "Set-Cookie": await commitSession(session),
      // },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return Response.json({
      success: false,
      message: error instanceof Error ? error.message : "Erro ao fazer login",
      error_code: 500,
      error_fields: {},
      data: {} as UserLoginResponse,
    });
  }
}
export default function LoginRoute() {
  // const { userInfo } = useLoaderData<typeof loader>() ?? {};
  return (
    <>
      <LoginPage />
    </>
  );
}
