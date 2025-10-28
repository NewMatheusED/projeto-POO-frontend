import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type { IUsuario } from "../user/typings";
import type { UserLoginResponse } from "./typing";

interface RegisterUser extends IUsuario {
  password: string;
}

class AuthService {
  async login(formInfo: {
    email: string;
    password: string;
  }): Promise<ApiResponse<UserLoginResponse>> {
    try {
      const response = await typedApiClient.post<UserLoginResponse>(
        `/v1/auth/login`,
        {
          ...formInfo,
        }
      );
      return response;
    } catch (error) {
      console.error("error do login", error);
      return {
        success: false,
        data: {} as UserLoginResponse,
        message: "Erro ao fazer login. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
  async register(user: RegisterUser): Promise<ApiResponse<IUsuario>> {
    try {
      const response = await typedApiClient.post<IUsuario>(
        "/v1/auth/register",
        user
      );
      return response;
    } catch (error) {
      console.error("error do register", error);
      return {
        success: false,
        data: {} as IUsuario,
        message:
          "Erro ao registrar usuário. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
  async logout(): Promise<ApiResponse<null>> {
    return await typedApiClient.post<null>("/v1/auth/logout");
  }
}

export const authService = new AuthService();
