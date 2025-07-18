export interface ValidityResponse {
  informacionDepartamental: InformacionDepartamental[];
  informacionMunicipal: InformacionMunicipal[];
}

export interface InformacionDepartamental {
  placa: string;
  declaracion: number;
  vigencia: number;
  codiMuniMatr: string;
  codiDeptoMatr: string;
  muniMatr: string;
  deptoMatr: string;
  avaluo: number;
  impto: number;
  sancion: number;
  interes: number;
  descuento: number;
  descSancion: number;
  descInteres: number;
  saldoPagar: number;
  sistema: number;
  total: number;
  codiMuniDest: string;
  codiDeptoDest: string;
  muniDest: string;
  deptoDest: string;
  valorMuni: number;
  valorDepto: number;
  fechaLim: Date;
  observacion: string;
}

export interface InformacionMunicipal {
  vigencia: number;
  numeLiqui: number;
  codiFactu: string;
  totalTransito: number;
  totalConsorcio: number;
  sistemaTransito: number;
  placa: string;
  municipio: string;
  observacion: string;
}
