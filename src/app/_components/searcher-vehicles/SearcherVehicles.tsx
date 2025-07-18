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
  resetSearchResults,
  resetValidityState,
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
import { useRouter, useSearchParams } from "next/navigation";
import { getDepartamentalInformation } from "@/helpers/departamental-information";
import { capitalizeFirstLetter } from "@/helpers/capitalize-first-letter";

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
  //const { parameters } = useSelector((state: RootState) => state.validity);
  const searchParams = useSearchParams();
  const departmentName = searchParams.get("departmentName");
  const router = useRouter();

  console.log("client", process.env);
  console.log("client", process.env.NEXT_PUBLIC_TOTAL_SCI_API_URL);
  console.log("cre", username);
  console.log("cre", password);
  console.log("test", process.env.UAPI);
  console.log("test", process.env.PAPI);

  /*useEffect(() => {
    if (parameters.idClientIuva === 0) {
      router.push("/");
    }
    if (parameters.idClientSci === 0) {
      router.push("/");
    }
    if (parameters.idParametro === 0) {
      router.push("/");
    }
  }, [parameters.idClientIuva, parameters.idClientSci, parameters.idParametro]);*/

  const sanitizeInput = (input: string): string => {
    const trimmedInput = input.trim();
    return trimmedInput
      .replace(/\s+/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();
  };

  const isValidPlate = (plate: string): boolean => {
    const plateRegex = /^[A-Z0-9]{1,10}$/;
    return plateRegex.test(plate.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeInput(rawValue);
    if (sanitizedValue.length <= 10) {
      setValue(sanitizedValue);
    }
  };

  const handleClick = async () => {
    const cleanValue = sanitizeInput(value);

    dispatch(resetSearchResults());

    if (!cleanValue) {
      setAlertMessage("Por favor ingresa una placa");
      setAlertTitle("Campo requerido");
      setAlertType("error");
      setShowAlert(true);
      posthog.capture("vehicle_search_failed", { reason: "empty_input" });
      return;
    }

    if (!isValidPlate(cleanValue)) {
      setAlertMessage("Formato de placa inválido");
      setAlertTitle("Error de formato");
      setAlertType("error");
      setShowAlert(true);
      posthog.capture("vehicle_search_failed", {
        reason: "invalid_plate_format",
        value: cleanValue,
      });
      return;
    }

    setIsLoading(true);
    posthog.capture("vehicle_search_started", {
      searchValue: cleanValue,
    });

    const token = await getToken({ username, password });

    try {
      const validities = await fetchValidities(
        cleanValue,
        token,
        `${getDepartamentalInformation(departmentName || "")?.id_client_iuva}`,
        getDepartamentalInformation(departmentName || "")?.idParametro || 0
      );

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

  const goBack = () => {
    dispatch(resetValidityState());
    router.back();
  };

  return (
    <section className={`${styles.searcherVehicles}`}>
      <div className={styles.vehiclesDesktopContainer}>
        <div className={styles.headerBackContainerDesktop}>
          <Button
            icon="pi pi-arrow-left"
            className={`${styles.buttonBackCustom} p-button-secondary mr-3`}
            rounded
            onClick={goBack}
            aria-label="Volver"
          />
          <h2 className={styles.titleBack}>
            Trámites de {capitalizeFirstLetter(departmentName || "")}
          </h2>
        </div>
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
