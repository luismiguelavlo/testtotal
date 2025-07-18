import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  MunicipalInformation,
  Validity,
} from "../../core/entities/validity.entity";

export interface Dispersion {
  palabraClave: string;
  referencia: string;
  liquidacion: string;
  entityCode: string;
  serviceCode: string;
  valor: string;
  impuesto: string;
  descripcion: string;
}

export interface PaymentDataSCI {
  idParametro: number;
  idCliente: number;
  referencia: string;
  descripcionPago: string;
  nombrePagador: string;
  tipoPagador: string;
  tipoIdentificacion: string;
  identificacion: string;
  email: string;
  telefono: string;
  valorTotal: string;
  iva: string;
  codigoBanco: string;
  dispersion: Dispersion[];
}

interface Parameters {
  idParametro: number;
  idClientIuva: number; //se usa para buscar deuda
  idClientSci: number; //se usa para pagar trámites
  departmentName: string;
}

interface ValidityState {
  parameters: Parameters;
  validities: Validity;
  validitiesMunicipalities: MunicipalInformation[][];
  totalValidities: number;
  clientEmail: string;
  paymentSumary: PaymentSumary;
  paymentDataSCI: PaymentDataSCI | null;
}

interface PaymentSumary {
  vehicleTax: number;
  municipalTransit: number;
  latePaymentInterest: number;
  sanction: number;
  discount: number;
  total: number;
  quantityVehiclesTax: number;
  quantityMunicipalTransit: number;
  quantityDiscount: number;
}

const initialState: ValidityState = {
  parameters: {
    idParametro: 0,
    idClientIuva: 0,
    idClientSci: 0,
    departmentName: "",
  },
  validities: {
    departmentalInformation: [],
    municipalInformation: [],
  },
  validitiesMunicipalities: [],
  totalValidities: 0,
  paymentDataSCI: null,
  clientEmail: "",
  paymentSumary: {
    vehicleTax: 0,
    municipalTransit: 0,
    latePaymentInterest: 0,
    sanction: 0,
    discount: 0,
    total: 0,
    quantityVehiclesTax: 0,
    quantityMunicipalTransit: 0,
    quantityDiscount: 0,
  },
};

// Necesitarás definir esta interfaz para el payload
interface RemoveValidityPayload {
  validity: number;
  plate: string;
}

export const validitySlice = createSlice({
  name: "validity",
  initialState,
  reducers: {
    resetValidityState: () => initialState,
    resetSearchResults: (state) => {
      state.validities = initialState.validities;
      state.validitiesMunicipalities = initialState.validitiesMunicipalities;
      state.totalValidities = initialState.totalValidities;
      state.clientEmail = initialState.clientEmail;
      state.paymentSumary = initialState.paymentSumary;
      state.paymentDataSCI = initialState.paymentDataSCI;
    },
    setValiditiesDepartmental: (
      state,
      action: PayloadAction<Validity["departmentalInformation"]>
    ) => {
      state.validities.departmentalInformation = action.payload;
    },
    setValidities: (state, action: PayloadAction<Validity>) => {
      state.validities = action.payload;
    },
    removeValidity: (state, action: PayloadAction<RemoveValidityPayload>) => {
      state.validities.municipalInformation =
        state.validities.municipalInformation.filter(
          (validity) =>
            validity.validity !== action.payload.validity ||
            validity.plate !== action.payload.plate
        );
    },
    setValiditiesMunicipalities: (
      state,
      action: PayloadAction<MunicipalInformation[][]>
    ) => {
      state.validitiesMunicipalities = action.payload;
    },
    removeValidityMunicipality: (state, action: PayloadAction<string>) => {
      state.validitiesMunicipalities = state.validitiesMunicipalities.filter(
        (validityGroup) =>
          !validityGroup.some((validity) => validity.plate === action.payload)
      );
    },
    setPaymentSumary: (state, action: PayloadAction<PaymentSumary>) => {
      state.paymentSumary = action.payload;
    },
    setTotalValidities: (state, action: PayloadAction<number>) => {
      state.totalValidities = action.payload;
    },
    setClientEmail: (state, action: PayloadAction<string>) => {
      state.clientEmail = action.payload;
    },
    setPaymentDataSCI: (state, action: PayloadAction<PaymentDataSCI>) => {
      state.paymentDataSCI = action.payload;
    },
    setParameters: (state, action: PayloadAction<Parameters>) => {
      state.parameters = action.payload;
    },
  },
});

export const {
  resetValidityState,
  resetSearchResults,
  setValidities,
  removeValidity,
  setValiditiesMunicipalities,
  removeValidityMunicipality,
  setPaymentSumary,
  setTotalValidities,
  setClientEmail,
  setPaymentDataSCI,
  setValiditiesDepartmental,
  setParameters,
} = validitySlice.actions;
