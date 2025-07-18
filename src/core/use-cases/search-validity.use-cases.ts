import { HttpAdapter } from "@/config/http/http.adapter";
import { ValidityMapper } from "../../infraestructure/mappers/validity.mapper";
import { Validity } from "../entities/validity.entity";
import { handleError } from "../handle-error/handlerError";
import { ValidityResponse } from "@/infraestructure/interfaces/validity-response.interface";

interface SearchValidityProps {
  plateOrDni: string;
  fetcher: HttpAdapter;
  token: string;
  idClient: string;
  idParametro: number;
}

export const searchValidity = async (
  props: SearchValidityProps
): Promise<Validity> => {
  try {
    const response = await props.fetcher.post<ValidityResponse>(
      `/TotalApp/DeudaPlaca/${props.idParametro}`,
      {
        idCliente: props.idClient,
        placa: props.plateOrDni,
      },
      { headers: { Authorization: `Bearer ${props.token}` } }
    );

    return ValidityMapper.fromResponseToEntity(response);
  } catch (error) {
    const processedError = handleError(error);
    console.error("Error procesado: ", processedError);
    throw new Error(`${processedError.message} ${processedError.status}`);
  }
};
