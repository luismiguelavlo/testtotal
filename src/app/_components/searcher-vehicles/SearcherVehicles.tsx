"use client";
import styles from "./SearcherVehicles.module.scss";
import { groupByValiditiesMunicipality } from "@/helpers/calculator-amounts";
import {
  sumDiscount,
  sumInterest,
  sumPenalty,
  sumTaxAndSystem,
  sumTransitIfActive,
  sumValidTotals,
} from "@/helpers/calculator-amounts";
import { countValiditiesWithDiscount } from "@/helpers/calculator-amounts";
import { useSearch } from "@/hooks/useSearch";
import {
  setPaymentSumary,
  setTotalValidities,
  setValidities,
  setValiditiesMunicipalities,
} from "@/store";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import posthog from "posthog-js"; // Importa PostHog
import CustomAlert from "@/components/commons/custom-alert/CustomAlert";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useGetToken } from "@/hooks/useGetToken";
import { validatePlateWithRateLimit, sanitizeInput } from "@/utils/security";

interface SearcherVehiclesProps {
  username: string;
  password: string;
}

export default function SearcherVehicles({
  username,
  password,
}: SearcherVehiclesProps) {
  const [value, setValue] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success">("error");
  const [alertTitle, setAlertTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { fetchValidities } = useSearch();
  const dispatch = useDispatch();
  const { getToken } = useGetToken();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeInput(rawValue).toUpperCase();
    if (sanitizedValue.length <= 10) {
      setValue(sanitizedValue);
    }
  };

  const handleClick = async () => {
    // Validar entrada con rate limiting
    const validation = validatePlateWithRateLimit(value);

    if (!validation.valid) {
      setAlertMessage(validation.message || "Error de validación");
      setAlertTitle("Error de validación");
      setAlertType("error");
      setShowAlert(true);
      posthog.capture("vehicle_search_failed", { reason: "validation_error" });
      return;
    }

    const cleanValue = sanitizeInput(value);

    dispatch(setValiditiesMunicipalities([]));
    dispatch(
      setValidities({
        departmentalInformation: [],
        municipalInformation: [],
      })
    );
    dispatch(setTotalValidities(0));
    dispatch(
      setPaymentSumary({
        vehicleTax: 0,
        municipalTransit: 0,
        latePaymentInterest: 0,
        sanction: 0,
        discount: 0,
        total: 0,
        quantityVehiclesTax: 0,
        quantityMunicipalTransit: 0,
        quantityDiscount: 0,
      })
    );

    if (!cleanValue) {
      setAlertMessage("Por favor ingresa una placa");
      setAlertTitle("Campo requerido");
      setAlertType("error");
      setShowAlert(true);
      posthog.capture("vehicle_search_failed", { reason: "empty_input" });
      return;
    }

    setIsLoading(true);
    posthog.capture("vehicle_search_started", {
      searchValue: cleanValue,
    });

    const token = await getToken({ username, password });

    try {
      const validities = await fetchValidities(cleanValue, token);

      if (validities.departmentalInformation === null) {
        setAlertMessage(
          "El vehículo consultado no tiene vigencias pendientes, para más detalles presione 'Soporte Gobernación'."
        );
        setAlertTitle("Búsqueda exitosa");
        setAlertType("success");
      }

      if (
        validities.departmentalInformation.length === 0 &&
        validities.municipalInformation.length === 0
      ) {
        setAlertMessage(
          'El vehiculo consultado no tiene vigencias pendientes, para más detalles presione "Soporte Gobernación".'
        );
        setAlertTitle("Busqueda exitosa");
        setAlertType("success");
        setShowAlert(true);

        return;
      }

      const groupedByPlate = groupByValiditiesMunicipality(
        validities.municipalInformation
      );

      dispatch(setValiditiesMunicipalities(groupedByPlate));

      dispatch(
        setTotalValidities(
          validities.departmentalInformation.length +
            validities.municipalInformation.length
        )
      );

      const groupedByPlateMunicipality = groupByValiditiesMunicipality(
        validities.municipalInformation
      );

      const taxAndSystematization = sumTaxAndSystem(
        validities.departmentalInformation
      );
      const totalDepartamentalValidities = sumValidTotals(
        validities.departmentalInformation
      );
      const totalTransit = sumTransitIfActive(groupedByPlateMunicipality);
      const interests = sumInterest(validities.departmentalInformation);
      const penalty = sumPenalty(validities.departmentalInformation);
      const discount = sumDiscount(validities.departmentalInformation);
      const totalAmountToPay = totalDepartamentalValidities + totalTransit;
      const quantityValiditiesWithDiscount = countValiditiesWithDiscount(
        validities.departmentalInformation
      );

      dispatch(
        setPaymentSumary({
          vehicleTax: taxAndSystematization,
          municipalTransit: totalTransit,
          latePaymentInterest: interests,
          sanction: penalty,
          discount: discount,
          total: totalAmountToPay,
          quantityVehiclesTax: validities.departmentalInformation.length,
          quantityMunicipalTransit: validities.municipalInformation.length,
          quantityDiscount: quantityValiditiesWithDiscount,
        })
      );

      dispatch(setValidities(validities));

      posthog.capture("vehicle_search_completed", {
        searchValue: cleanValue,
        resultsCount:
          validities.departmentalInformation.length +
          validities.municipalInformation.length,
        vehicleTaxCount: validities.departmentalInformation.length,
        municipalTransitCount: validities.municipalInformation.length,
        hasDiscount: quantityValiditiesWithDiscount > 0,
        discountCount: quantityValiditiesWithDiscount,
        totalAmount: totalAmountToPay,
        hasInterests: interests > 0,
        hasPenalty: penalty > 0,
      });
    } catch (error) {
      setAlertMessage("Ocurrió un error al buscar el vehículo");
      setAlertTitle("Error");
      setAlertType("error");
      setShowAlert(true);

      posthog.capture("vehicle_search_failed", {
        reason: "api_error",
        searchValue: cleanValue,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  return (
    <section className={`${styles.searcherVehicles}`}>
      <h4 className={styles.title}>
        Añade las vigencias pendientes de tus vehículos
      </h4>
      <div className={styles.searcherVehiclesContainer}>
        <InputText
          type="text"
          className={`${styles.input}`}
          placeholder="Ingresa tu placa"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          maxLength={10}
          style={{ textTransform: "uppercase" }}
        />
        <Button
          icon={isLoading ? "pi pi-spinner pi-spin" : "pi pi-search"}
          rounded
          aria-label="Filter"
          className={`${styles.buttonCircle} p-button-primary`}
          onClick={handleClick}
          disabled={isLoading}
        />
      </div>
      {isLoading && <p className={styles.loading}>Cargando...</p>}
      <CustomAlert
        show={showAlert}
        message={alertMessage}
        title={alertTitle}
        type={alertType}
        onClose={handleAlertClose}
        autoClose={true}
        autoCloseTime={3000}
      />
    </section>
  );
}
