"use client";
import styles from "./SearcherFooter.module.scss";
import {
  Dispersion,
  PaymentDataSCI,
  RootState,
  setPaymentDataSCI,
} from "@/store";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import CustomAlert from "@/components/commons/custom-alert/CustomAlert";
import { Button } from "primereact/button";
import * as Sentry from "@sentry/nextjs";
import { getDepartamentalInformation } from "@/helpers/departamental-information";

export default function SearcherFooter() {
  const [totalAmountToPay, setTotalAmountToPay] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const { paymentSumary, totalValidities /*parameters*/ } = useSelector(
    (state: RootState) => state.validity
  );
  const searchParams = useSearchParams();
  const departmentName = searchParams.get("departmentName");
  const dispatch = useDispatch();

  const navigate = useRouter();
  const validities = useSelector(
    (state: RootState) => state.validity.validities
  );
  const validitiesMunicipalities = useSelector(
    (state: RootState) => state.validity.validitiesMunicipalities
  );

  const isPayDisabled =
    validities.departmentalInformation.length === 0 &&
    validitiesMunicipalities.length === 0;

  const generateCheckoutData = () => {
    const dispersion: Dispersion[] = [];
    //vigencias departamentales
    validities.departmentalInformation.forEach((validity) => {
      if (validity.total && validity.total > 0) {
        dispersion.push({
          palabraClave: "RECAUDO_IUVA",
          referencia: `${validity.declaration || ""}`,
          liquidacion: "",
          entityCode: "",
          serviceCode: "",
          valor: `${validity.total}`,
          impuesto: "0",
          descripcion: `NOTIFICACION IUVA GENERADO DE TOTAL EL MONTO INCLUYE EL VALOR DE LA SISTEMATIZACIÓN (PLACA: ${validity.plate} VIGENCIA: ${validity.validity})`,
        });
        setTotalAmountToPay(totalAmountToPay + validity.total);
      }
    });

    //vigencias municipales
    validitiesMunicipalities.forEach((validities) => {
      validities.forEach((validity) => {
        switch (validity.registrationMunicipality.toUpperCase()) {
          case "BUCARAMANGA":
            dispersion.push({
              palabraClave: "RECAUDO_TRANSITO_BUCARAMANGA",
              referencia: `${validity.invoiceCode || ""}`,
              liquidacion: `${validity.liquidationNumber || ""}`,
              entityCode: "",
              serviceCode: "",
              valor: `${validity.totalTransit}`,
              impuesto: "0",
              descripcion: `NOTIFICACION TRANSITO BUCARAMANGA GENERADO DE TOTAL (PLACA: ${validity.plate} VIGENCIA: ${validity.validity})`,
            });
            dispersion.push({
              palabraClave: "SISTEMATIZACION_TRANSITO",
              referencia: `${validity.invoiceCode || ""}`,
              liquidacion: "",
              entityCode: "",
              serviceCode: "",
              valor: `${validity.transitSystem}`,
              impuesto: "0",
              descripcion: `SISTEMATIZACION TRANSITO GENERADO DE TOTAL (PLACA: ${validity.plate} VIGENCIA: ${validity.validity})`,
            });
            setTotalAmountToPay(
              totalAmountToPay + validity.transitSystem + validity.totalTransit
            );
            break;
          case "GIRON":
            dispersion.push({
              palabraClave: "RECAUDO_TRANSITO_GIRON",
              referencia: `${validity.invoiceCode || ""}`,
              liquidacion: `${validity.liquidationNumber || ""}`,
              entityCode: "",
              serviceCode: "",
              valor: `${validity.totalTransit}`,
              impuesto: "0",
              descripcion: `NOTIFICACION TRANSITO GIRON GENERADO DE TOTAL (PLACA: ${validity.plate} VIGENCIA: ${validity.validity})`,
            });
            dispersion.push({
              palabraClave: "SISTEMATIZACION_TRANSITO",
              referencia: `${validity.invoiceCode || ""}`,
              liquidacion: "",
              entityCode: "",
              serviceCode: "",
              valor: `${validity.transitSystem}`,
              impuesto: "0",
              descripcion: `SISTEMATIZACION TRANSITO GENERADO DE TOTAL (PLACA: ${validity.plate} VIGENCIA: ${validity.validity})`,
            });
            setTotalAmountToPay(
              totalAmountToPay + validity.transitSystem + validity.totalTransit
            );
            break;
          case "FLORIDABLANCA":
            dispersion.push({
              palabraClave: "RECAUDO_TRANSITO_FLORIDABLANCA",
              referencia: `${validity.invoiceCode || ""}`,
              liquidacion: `${validity.liquidationNumber || ""}`,
              entityCode: "",
              serviceCode: "",
              valor: `${validity.totalTransit}`,
              impuesto: "0",
              descripcion: `NOTIFICACION TRANSITO FLORIDABLANCA GENERADO DE TOTAL (PLACA: ${validity.plate} VIGENCIA: ${validity.validity})`,
            });
            dispersion.push({
              palabraClave: "SISTEMATIZACION_TRANSITO",
              referencia: `${validity.invoiceCode || ""}`,
              liquidacion: "",
              entityCode: "",
              serviceCode: "",
              valor: `${validity.transitSystem}`,
              impuesto: "0",
              descripcion: `SISTEMATIZACION TRANSITO GENERADO DE TOTAL (PLACA: ${validity.plate} VIGENCIA: ${validity.validity})`,
            });
            setTotalAmountToPay(
              totalAmountToPay + validity.transitSystem + validity.totalTransit
            );
            break;
          case "BARRANCABERMEJA":
            dispersion.push({
              palabraClave: "RECAUDO_TRANSITO_BARRANCABERMEJA",
              referencia: `${validity.invoiceCode || ""}`,
              liquidacion: `${validity.liquidationNumber || ""}`,
              entityCode: "",
              serviceCode: "",
              valor: `${validity.totalTransit}`,
              impuesto: "0",
              descripcion: `NOTIFICACION TRANSITO BARRANCABERMEJA GENERADO DE TOTAL (PLACA: ${validity.plate} VIGENCIA: ${validity.validity})`,
            });
            dispersion.push({
              palabraClave: "SISTEMATIZACION_TRANSITO",
              referencia: `${validity.invoiceCode || ""}`,
              liquidacion: "",
              entityCode: "",
              serviceCode: "",
              valor: `${validity.transitSystem}`,
              impuesto: "0",
              descripcion: `SISTEMATIZACION TRANSITO GENERADO DE TOTAL (PLACA: ${validity.plate} VIGENCIA: ${validity.validity})`,
            });
            if (validity.totalConsortium && validity.totalConsortium > 0) {
              dispersion.push({
                palabraClave: "RECAUDO_CONSORCIO_BARRANCABERMEJA",
                referencia: `${validity.invoiceCode || ""}`,
                liquidacion: `${validity.liquidationNumber || ""}`,
                entityCode: "",
                serviceCode: "",
                valor: `${validity.totalConsortium}`,
                impuesto: "0",
                descripcion: `SISTEMATIZACION CONSORCIO GENERADO DE TOTAL (PLACA: ${validity.plate} VIGENCIA: ${validity.validity})`,
              });
              setTotalAmountToPay(
                totalAmountToPay +
                  validity.transitSystem +
                  validity.totalTransit +
                  validity.totalConsortium
              );
            } else {
              setTotalAmountToPay(
                totalAmountToPay +
                  validity.transitSystem +
                  validity.totalTransit
              );
            }
            break;
          default:
            throw new Error("Municipalidad no implementada");
            break;
        }
      });
    });

    const paymentDataSCI: PaymentDataSCI = {
      idParametro:
        getDepartamentalInformation(departmentName || "")?.idParametro || 0,
      idCliente:
        getDepartamentalInformation(departmentName || "")?.id_client_sci || 0,
      referencia: "",
      descripcionPago: "Pago de trámites desde plataforma total",
      nombrePagador: "",
      tipoPagador: "",
      tipoIdentificacion: "",
      identificacion: "",
      email: "",
      telefono: "",
      valorTotal: "",
      iva: "0",
      codigoBanco: "",
      dispersion: [],
    };

    if (dispersion.length <= 0) {
      const error = new Error("Dispersión vacía al generar datos de checkout");
      Sentry.captureException(error, {
        extra: {
          validitiesDepartmental: validities.departmentalInformation,
          validitiesMunicipalities,
          totalAmount: paymentSumary.total,
          totalValidities,
        },
      });

      posthog.capture("checkout_error", {
        errorType: "empty_dispersion",
        step: "generate_checkout",
      });

      setAlertTitle(
        "Error en el proceso de pago, realice el pago nuevamente o contacte a soporte"
      );
      setShowAlert(true);
      return "error";
    }

    paymentDataSCI.dispersion = dispersion;
    dispatch(setPaymentDataSCI(paymentDataSCI));
  };

  const gotToConfirmationOrder = () => {
    const hasObservations = validities.departmentalInformation.some(
      (validity) => validity.observation && validity.observation.length > 0
    );

    if (hasObservations) {
      setAlertTitle(
        "Una o varias de tus vigencias tiene observaciones y no puede ser pagada por este medio, elimina la vigencia en conflicto para continuar con tu pago"
      );
      setShowAlert(true);
      return;
    }

    const hasObservationsMunicipalities = validitiesMunicipalities.some(
      (municipalityGroup) =>
        municipalityGroup.some(
          (validity) => validity.observation && validity.observation.length > 0
        )
    );

    if (hasObservationsMunicipalities) {
      setAlertTitle(
        "Una o varias de tus vigencias tiene observaciones y no puede ser pagada por este medio, elimina la vigencia en conflicto para continuar con tu pago"
      );
      setShowAlert(true);
      return;
    }

    const result = generateCheckoutData();

    if (result === "error") {
      return;
    }

    // Captura el evento de proceder al checkout
    posthog.capture("proceed_to_checkout", {
      validitiesCount: validities.departmentalInformation.length,
      totalAmount: validities.departmentalInformation.reduce(
        (sum, v) => sum + (v.total || 0),
        0
      ),
      hasMunicipalTransit: validitiesMunicipalities?.length > 0,
      municipalTransitCount: validitiesMunicipalities?.length || 0,
    });

    // If no null totals, proceed with the original function
    navigate.push("/confirmation-order");
  };

  const recalculateTotal = () => {
    let newTotal = 0;

    // Calcular total de vigencias departamentales
    validities.departmentalInformation.forEach((validity) => {
      if (validity.total && validity.total > 0) {
        newTotal += validity.total;
      }
    });

    // Calcular total de vigencias municipales
    validitiesMunicipalities.forEach((validities) => {
      validities.forEach((validity) => {
        if (validity.totalTransit) newTotal += validity.totalTransit;
        if (validity.transitSystem) newTotal += validity.transitSystem;
        if (validity.totalConsortium) newTotal += validity.totalConsortium;
      });
    });

    setTotalAmountToPay(newTotal);
  };

  const shouldShowRefreshButton = () => {
    const hasDepartmentalValidities =
      validities.departmentalInformation.length > 0;
    const hasMunicipalValidities = validitiesMunicipalities.some(
      (group) => group.length > 0
    );
    const hasZeroTotal = paymentSumary.total === 0;
    const hasZeroValidities = totalValidities === 0;

    return (
      (hasDepartmentalValidities || hasMunicipalValidities) &&
      (hasZeroTotal || hasZeroValidities)
    );
  };

  return (
    <>
      <CustomAlert
        show={showAlert}
        message={alertTitle}
        onClose={() => setShowAlert(false)}
        autoClose={true}
        autoCloseTime={5000}
      />
      <section className={styles.searcherFooterContainer}>
        <div className={styles.searcherFooterContainerResult}>
          <div className={styles.totalHeader}>
            <h4 className={styles.searcherFooterContainerResultTitle}>
              TOTAL ({totalValidities} vigencias)
            </h4>
          </div>
          <p className={styles.searcherFooterContainerResultPrice}>
            $ {paymentSumary.total.toLocaleString()}
          </p>
        </div>
        <div className={styles.searcherFooterContainerButton}>
          {shouldShowRefreshButton() && (
            <Button
              icon="pi pi-refresh"
              className={`${styles.recalculateTotalButton} p-button-secondary`}
              onClick={recalculateTotal}
              style={{ padding: "0.3rem" }}
            />
          )}
          <Button
            label="Pagar"
            rounded
            className={`${styles.searcherFooterContainerButtonButton} p-button-primary`}
            onClick={gotToConfirmationOrder}
            disabled={isPayDisabled}
          />
        </div>
      </section>
    </>
  );
}
