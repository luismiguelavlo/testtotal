import {
  DepartmentalInformation,
  MunicipalInformation,
  Validity,
} from "../../core/entities/validity.entity";
import {
  ValidityResponse,
  InformacionDepartamental,
  InformacionMunicipal,
} from "../interfaces/validity-response.interface";

export const ValidityMapper = {
  fromResponseToEntity: (response: ValidityResponse): Validity => {
    // Map departmental information
    const departmentalInfo =
      response.informacionDepartamental?.map(
        (info: InformacionDepartamental) =>
          new DepartmentalInformation(
            info.placa,
            info.declaracion,
            info.vigencia,
            info.codiMuniMatr,
            info.codiDeptoMatr,
            info.muniMatr,
            info.deptoMatr,
            info.avaluo,
            info.impto,
            info.sancion,
            info.interes,
            info.descuento,
            info.descSancion,
            info.descInteres,
            info.saldoPagar,
            info.sistema,
            info.total,
            info.codiMuniDest,
            info.codiDeptoDest,
            info.muniDest,
            info.deptoDest,
            info.valorMuni,
            info.valorDepto,
            info.fechaLim.toString(),
            info.observacion
          )
      ) || [];

    // Map municipal information
    const municipalInfo =
      response.informacionMunicipal?.map(
        (info: InformacionMunicipal) =>
          new MunicipalInformation(
            info.vigencia,
            info.numeLiqui,
            info.codiFactu,
            info.totalTransito,
            info.totalConsorcio,
            info.sistemaTransito,
            info.placa,
            info.municipio,
            info.observacion
          )
      ) || [];

    // Create and return the Validity entity with both arrays
    return new Validity(departmentalInfo, municipalInfo);
  },
};
