import { useState } from "react";
import * as useCases from "../core";
import { PaymentDataSCI } from "../store";
import { totalSciApiFetcher } from "@/config/total-sci-api.adapter";

export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generateCheckout = async (
    paymentDataSCI: PaymentDataSCI,
    token: string
  ) => {
    try {
      setIsLoading(true);
      const response = await useCases.generateCheckoutUseCases(
        totalSciApiFetcher,
        paymentDataSCI,
        token
      );
      return response;
    } catch (error) {
      console.log("Error when generating checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    generateCheckout,
  };
};
