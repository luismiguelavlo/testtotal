import { PaymentDataSCI } from "../../store";
import { handleError } from "../handle-error/handlerError";
import { CheckoutSCIResponse } from "@/infraestructure/interfaces/checkout-sci-response.interface";
import { HttpAdapter } from "@/config/http/http.adapter";

export const generateCheckoutUseCases = async (
  fetcher: HttpAdapter,
  paymentDataSCI: PaymentDataSCI,
  token: string
): Promise<string> => {
  try {
    const response = await fetcher.post<CheckoutSCIResponse>(
      "/TotalApp/CrearTransaccion",
      { ...paymentDataSCI },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.url;
  } catch (error) {
    const processedError = handleError(error);
    console.error("Error procesado: ", processedError);
    throw new Error(`${processedError.message} ${processedError.status}`);
  }
};
