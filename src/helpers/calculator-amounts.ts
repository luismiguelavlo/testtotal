import {
  DepartmentalInformation,
  MunicipalInformation,
} from "@/core/entities/validity.entity";

/**
 * Calculates the sum of all valid 'total' values in an array of DepartmentalInformation objects.
 * Null or undefined values are ignored in the calculation.
 *
 * @param arr - Array of DepartmentalInformation objects to process
 * @returns The sum of all non-null total values
 */
export function sumValidTotals(arr: DepartmentalInformation[]): number {
  return arr.reduce((sum, item) => {
    const total = item.total ?? 0;
    return sum + total;
  }, 0);
}

/**
 * Calculates the sum of 'totalTransit' and 'transitSystem' values for all MunicipalInformation objects.
 *
 * @param arr - Array of MunicipalInformation objects to process
 * @returns The sum of totalTransit and transitSystem
 */
export function sumTransitIfActive(arr: MunicipalInformation[][]): number {
  return arr.flat().reduce((sum, item) => {
    const totalTransit = item.totalTransit || 0;
    const transitSystem = item.transitSystem || 0;
    const totalConsortium = item.totalConsortium || 0;
    return sum + totalTransit + transitSystem + totalConsortium;
  }, 0);
}

/**
 * Calculates the sum of 'tax' and 'system' values for all DepartmentalInformation objects.
 * Null or undefined values are treated as 0.
 *
 * @param arr - Array of DepartmentalInformation objects to process
 * @returns The sum of tax and system values
 */
export function sumTaxAndSystem(arr: DepartmentalInformation[]): number {
  return arr.reduce((sum, item) => {
    const tax = item.tax ?? 0; // If tax is null or undefined, treat it as 0
    const system = item.system ?? 0; // If system is null or undefined, treat it as 0
    return sum + tax + system;
  }, 0);
}

/**
 * Calculates the sum of all 'interest' values in an array of DepartmentalInformation objects.
 * Null or undefined values are treated as 0.
 *
 * @param records - Array of DepartmentalInformation objects to process
 * @returns The sum of all interest values
 */
export function sumInterest(records: DepartmentalInformation[]): number {
  return records.reduce((total, record) => {
    const interest = record.interest ?? 0;
    return total + (typeof interest === "number" ? interest : 0);
  }, 0);
}

/**
 * Calculates the sum of all 'penalty' values in an array of DepartmentalInformation objects.
 * Only numeric penalty values are included in the sum.
 *
 * @param records - Array of DepartmentalInformation objects to process
 * @returns The sum of all numeric penalty values
 */
export function sumPenalty(records: DepartmentalInformation[]): number {
  return records.reduce((total, record) => {
    const penalty = record.penalty ?? 0;
    return total + (typeof penalty === "number" ? penalty : 0);
  }, 0);
}

/**
 * Calculates the sum of all 'discount' values in an array of DepartmentalInformation objects.
 * Null or undefined values are treated as 0.
 *
 * @param records - Array of DepartmentalInformation objects to process
 * @returns The sum of all discount values
 */
export function sumDiscount(records: DepartmentalInformation[]): number {
  return records.reduce((total, record) => {
    const discount = record.discount ?? 0;
    return total + (typeof discount === "number" ? discount : 0);
  }, 0);
}

/**
 * Counts the number of DepartmentalInformation objects in an array that have a discount greater than 0.
 *
 * @param validities - Array of DepartmentalInformation objects to check
 * @returns The count of DepartmentalInformation objects with discount > 0
 */
export function countValiditiesWithDiscount(
  validities: DepartmentalInformation[]
): number {
  if (!validities || !validities.length) {
    return 0;
  }

  return validities.filter(
    (validity) =>
      validity.discount !== null &&
      validity.discount !== undefined &&
      validity.discount > 0
  ).length;
}

export const groupByValiditiesMunicipality = (
  validitiesMunicipality: MunicipalInformation[]
) => {
  return Object.values(
    validitiesMunicipality.reduce(
      (
        acc: Record<string, MunicipalInformation[]>,
        item: MunicipalInformation
      ) => {
        if (!acc[item.plate]) {
          acc[item.plate] = [];
        }
        acc[item.plate].push(item);
        return acc;
      },
      {}
    )
  );
};
