import { toast } from "react-hot-toast";
import type { ApiResponse } from "~/features/apiClient/typings";
import { authService } from "~/features/auth/service";
import type { IUsuario } from "~/features/user/typings";
import type { Route } from "./+types/route";
import RegistroPage from "./page";
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const name = formData.get("name");
  const password = formData.get("password");
  const responsePromise = authService
    .register({
      email: email as string,
      name: name as string,
      password: password as string,
    })
    .then((response) => {
      if (!response.success) {
        const errorObj = new Error(response.message);
        Object.assign(errorObj, { ...response });
        throw errorObj;
      }
      return response;
    });
  toast.promise(responsePromise, {
    loading: "Carregando...",
    success: (msg: ApiResponse<IUsuario>) => {
      window.setTimeout(() => {
        window.location.href = "/interno";
      }, 1000);
      return <p>{msg.message}</p>;
    },
    error: (err: ApiResponse<IUsuario>) => (
      <div>
        <p className="text-nowrap">{`${err.message || ""}`}</p>
        {err.error_fields && Object.keys(err.error_fields).length > 0 && (
          <ul className="list-disc">
            {Object.keys(err.error_fields).map((field) => (
              <li className="font-bold" key={field}>
                <p>{err?.error_fields?.[field]?.join(", ")}</p>
              </li>
            ))}
          </ul>
        )}
        <p>
          <u>Código: {err.error_code}</u>
        </p>
      </div>
    ),
  });
  let response = null;
  try {
    console.log("response do await responsePromise", response);
    response = await responsePromise;
    return response;
  } catch (error) {
    console.log("error do await responsePromise", error);
    response = error;
    return response;
  }
}

export default function RegistroRoute() {
  return <RegistroPage />;
}
