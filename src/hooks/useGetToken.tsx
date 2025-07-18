"use client";
import { useState } from "react";
import * as useCases from "../core";
import { totalSciApiFetcher } from "@/config/total-sci-api.adapter";
import { validateCredentials } from "@/utils/security";

export interface GetTokenProps {
  password: string;
  username: string;
}

export const useGetToken = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getToken = async ({ password, username }: GetTokenProps) => {
    try {
      // Validación básica de credenciales
      if (
        !username ||
        !password ||
        username.trim() === "" ||
        password.trim() === ""
      ) {
        throw new Error("Credenciales requeridas");
      }

      // Validación de longitud
      if (username.length > 100 || password.length > 100) {
        throw new Error("Credenciales demasiado largas");
      }

      setIsLoading(true);
      return await useCases.getTokenUseCase(totalSciApiFetcher, {
        Password: password as string,
        Username: username as string,
      });
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getToken,
  };
};
