import { AuthSCIResponse } from "@/infraestructure/interfaces/auth-sci-response.interface";
import { handleError } from "../handle-error/handlerError";
import { HttpAdapter } from "@/config/http/http.adapter";

interface props {
  Username: string;
  Password: string;
}

export const getTokenUseCase = async (
  fetcher: HttpAdapter,
  { Password, Username }: props
): Promise<string> => {
  try {
    const data = {
      Username,
      Password,
    };

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const response = await fetcher.post<AuthSCIResponse>(
      "/Autenticacion",
      data,
      {
        headers,
      }
    );

    return response.token;
  } catch (error) {
    const processedError = handleError(error);
    console.error("Error procesado: ", processedError);
    throw new Error(`${processedError.message} ${processedError.status}`);
  }
};
