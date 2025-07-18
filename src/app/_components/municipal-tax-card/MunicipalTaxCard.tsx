import { MunicipalInformation } from "@/core/entities/validity.entity";
import { Card } from "primereact/card";
import React from "react";
import styles from "./MunicipalTaxCard.module.scss";
import { Button } from "primereact/button";
interface SearcherCardProps {
  title: string;
  identifier: string;
  validities: MunicipalInformation[];
  onDelete?: () => void;
  year?: number;
}

export default function MunicipalTaxCard({
  title,
  identifier,
  validities,
  onDelete,
  year,
}: SearcherCardProps) {
  return (
    <Card className={styles.searcherCard}>
      <div className={styles.cardContent}>
        <div className={styles.leftContent}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.amountContainer}>
            {validities.map((validity) => (
              <p className={styles.amount} key={validity.validity}>
                <span className={styles.title}>{validity.validity}</span> ${" "}
                {(
                  validity.totalTransit +
                  validity.transitSystem +
                  validity.totalConsortium
                ).toLocaleString()}
              </p>
            ))}
          </div>
        </div>
        <div className={styles.rightContent}>
          <span className={styles.identifier}>{identifier}</span>
          {onDelete && (
            <Button
              icon="pi pi-trash"
              className={styles.deleteButton}
              severity="danger"
              rounded
              text
              aria-label="Delete"
              onClick={onDelete}
            />
          )}
        </div>
      </div>
      {validities.some((validity) => validity.observation?.length > 0) && (
        <div className={styles.observationsContainer}>
          <p className={styles.danger}>
            {
              validities.find((validity) => validity.observation?.length > 0)
                ?.observation
            }
          </p>
        </div>
      )}
    </Card>
  );
}
