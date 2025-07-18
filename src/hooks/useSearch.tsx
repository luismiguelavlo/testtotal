import { totalSciApiFetcher } from "@/config/total-sci-api.adapter";
import * as UseCases from "../core";

export const useSearch = () => {
  const fetchValidities = async (
    plateOrDni: string,
    token: string,
    idClient: string,
    idParametro: number
  ) => {
    return await UseCases.searchValidity({
      plateOrDni,
      fetcher: totalSciApiFetcher,
      token,
      idClient,
      idParametro,
    });
  };

  return { fetchValidities };
};
