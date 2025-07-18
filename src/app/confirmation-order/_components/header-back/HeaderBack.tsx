"use client";
import { Button } from "primereact/button";
import styles from "./HeaderBack.module.scss";
import { useRouter } from "next/navigation";

const HeaderBack = () => {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <div className={styles.headerBackContainer}>
        <Button
          icon="pi pi-arrow-left"
          className={`${styles.buttonCustom} p-button-secondary mr-3`}
          rounded
          onClick={() => router.back()}
          aria-label="Volver"
        />
        <p className={styles.title}>Resumen de pago</p>
      </div>
    </header>
  );
};

export default HeaderBack;
