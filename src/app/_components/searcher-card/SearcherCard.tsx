import React from "react";
import styles from "./SearcherCard.module.scss";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
interface SearcherCardProps {
  title: string;
  amount: number | null;
  identifier: string;
  onDelete?: () => void;
  year?: number;
  observation: string;
}

export default function SearcherCard({
  title,
  amount,
  identifier,
  onDelete,
  year,
  observation,
}: SearcherCardProps) {
  return (
    <Card className={styles.searcherCard}>
      <div className={styles.cardContent}>
        <div className={styles.leftContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.amount}>
            <span className={styles.title}>{year}</span> ${" "}
            {amount === null ? "Valor sin calcular" : amount.toLocaleString()}
          </p>
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
      {observation.length > 0 && <p className={styles.danger}>{observation}</p>}
    </Card>
  );
}
