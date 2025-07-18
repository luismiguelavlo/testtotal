"use client";
import styles from "./SearcherContentCard.module.scss";
import { MunicipalInformation } from "@/core/entities/validity.entity";
import {
  sumInterest,
  sumPenalty,
  sumValidTotals,
} from "@/helpers/calculator-amounts";
import { countValiditiesWithDiscount } from "@/helpers/calculator-amounts";
import { sumDiscount } from "@/helpers/calculator-amounts";
import { DepartmentalInformation } from "@/core/entities/validity.entity";
import {
  sumTaxAndSystem,
  sumTransitIfActive,
} from "@/helpers/calculator-amounts";
import {
  removeValidity,
  removeValidityMunicipality,
  RootState,
  setPaymentSumary,
  setTotalValidities,
  setValiditiesDepartmental,
} from "@/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MunicipalTaxCard from "../municipal-tax-card/MunicipalTaxCard";
import SearcherCard from "../searcher-card/SearcherCard";
import { useSearchParams } from "next/navigation";

interface ItemsToRemove {
  departmental: { validity: number; plate: string }[];
  municipal: string[];
}

const SPECIAL_MUNICIPALITIES: { [key: string]: string } = {
  giron: "Girón",
};

export default function SearcherContentCard() {
  const validities = useSelector(
    (state: RootState) => state.validity.validities
  );

  const validitiesMunicipalities = useSelector(
    (state: RootState) => state.validity.validitiesMunicipalities
  );

  //const { parameters } = useSelector((state: RootState) => state.validity);
  const searchParams = useSearchParams();
  const departmentName = searchParams.get("departmentName");

  const dispatch = useDispatch();

  const [itemsToRemove, setItemsToRemove] = useState<ItemsToRemove>({
    departmental: [],
    municipal: [],
  });

  // New function to recalculate payment summary
  const recalculatePaymentSummary = (
    departmentalInformation: DepartmentalInformation[],
    updatedMunicipalities?: MunicipalInformation[][]
  ) => {
    const municipalitiesToUse =
      updatedMunicipalities || validitiesMunicipalities;

    const municipalCount = municipalitiesToUse.reduce(
      (total, group) => total + group.length,
      0
    );

    dispatch(
      setTotalValidities(departmentalInformation.length + municipalCount)
    );

    const taxAndSystematization = sumTaxAndSystem(departmentalInformation);

    const totalTransit = sumTransitIfActive(municipalitiesToUse);

    const interests = sumInterest(departmentalInformation);
    const penalty = sumPenalty(departmentalInformation);
    const discount = sumDiscount(departmentalInformation);
    const totalAmountToPay =
      sumValidTotals(departmentalInformation) + totalTransit;
    const quantityValiditiesWithDiscount = countValiditiesWithDiscount(
      departmentalInformation
    );

    dispatch(
      setPaymentSumary({
        vehicleTax: taxAndSystematization,
        municipalTransit: totalTransit,
        latePaymentInterest: interests,
        sanction: penalty,
        discount: discount,
        total: totalAmountToPay,
        quantityVehiclesTax: departmentalInformation.length,
        quantityMunicipalTransit: municipalCount,
        quantityDiscount: quantityValiditiesWithDiscount,
      })
    );
  };

  const handleDelete = (validityId: number, plate: string) => {
    // Mark this item for removal animation
    setItemsToRemove((prev) => ({
      ...prev,
      departmental: [...prev.departmental, { validity: validityId, plate }],
    }));

    // Set a timeout to actually remove the item after animation completes
    setTimeout(() => {
      dispatch(removeValidity({ validity: validityId, plate }));

      // Get updated state after removal
      const updatedValidities = validities.departmentalInformation.filter(
        (v) => !(v.validity === validityId && v.plate === plate)
      );
      dispatch(setValiditiesDepartmental(updatedValidities));

      // Recalculate payment summary with updated data
      recalculatePaymentSummary(updatedValidities);

      // Clear this item from the removal list
      setItemsToRemove((prev) => ({
        ...prev,
        departmental: prev.departmental.filter(
          (item) => !(item.validity === validityId && item.plate === plate)
        ),
      }));
    }, 800); // Match animation duration
  };

  // Handle municipal validity removal
  const handleDeleteMunicipality = (plate: string) => {
    // Mark this item for removal animation
    setItemsToRemove((prev) => ({
      ...prev,
      municipal: [...prev.municipal, plate],
    }));

    // Set a timeout to actually remove the item after animation completes
    setTimeout(() => {
      // Dispatch the action to remove the municipality
      dispatch(removeValidityMunicipality(plate));

      // Get the updated municipalities after removal
      const updatedMunicipalities = validitiesMunicipalities.filter(
        (group) => group[0].plate !== plate
      );

      // Recalculate payment summary with updated data
      recalculatePaymentSummary(
        validities.departmentalInformation,
        updatedMunicipalities
      );

      // Clear this item from the removal list
      setItemsToRemove((prev) => ({
        ...prev,
        municipal: prev.municipal.filter((id) => id !== plate),
      }));
    }, 800); // Match animation duration
  };

  const getTitleValidityDepartment = (
    validity: DepartmentalInformation
  ): string => {
    return `Imp. Vehicular - ${capitalize(departmentName || "")}`;
  };

  function capitalize(text: string): string {
    if (!text) return "";

    const normalizedText = text.toLowerCase();

    // Verificar si es un caso especial
    if (normalizedText in SPECIAL_MUNICIPALITIES) {
      return SPECIAL_MUNICIPALITIES[normalizedText];
    }

    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  return (
    <section className={styles.searcherContentCardContainer}>
      {validitiesMunicipalities.map((validity) => (
        <div
          key={validity[0].invoiceCode || validity[0].plate}
          className={`${styles.cardWrapper} ${
            itemsToRemove.municipal.includes(validity[0].plate)
              ? "animate__animated animate__backOutRight"
              : ""
          }`}
          style={{ animationDuration: "0.8s" }} // Ensure animation duration matches timeout
        >
          <MunicipalTaxCard
            title={`Tránsito Municipal - ${capitalize(
              validity[0].registrationMunicipality
            )}`}
            identifier={validity[0].plate}
            onDelete={() => handleDeleteMunicipality(validity[0].plate)}
            validities={validity}
          />
        </div>
      ))}
      {validities.departmentalInformation.map((validity) => (
        <div
          key={validity.plate + validity.validity}
          className={`${styles.cardWrapper} ${
            itemsToRemove.departmental.some(
              (item) =>
                item.validity === validity.validity &&
                item.plate === validity.plate
            )
              ? "animate__animated animate__backOutRight"
              : ""
          }`}
          style={{ animationDuration: "0.8s" }} // Ensure animation duration matches timeout
        >
          {validity.observation && validity.observation.length > 0 ? (
            <SearcherCard
              title={getTitleValidityDepartment(validity)}
              amount={null}
              year={validity.validity}
              identifier={validity.plate}
              onDelete={() => handleDelete(validity.validity, validity.plate)}
              observation={validity.observation}
            />
          ) : (
            <SearcherCard
              title={getTitleValidityDepartment(validity)}
              amount={validity.total}
              year={validity.validity}
              identifier={validity.plate}
              onDelete={() => handleDelete(validity.validity, validity.plate)}
              observation={validity.observation}
            />
          )}
        </div>
      ))}
    </section>
  );
}
