"use client";
import React, { useEffect } from "react";
import { Button } from "primereact/button";
import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, []);
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <img src="/imgs/failure.webp" alt="Error Payment" />
        <h2>Transacción Fallida</h2>
        <p>Lo sentimos, tu pago no puedo ser procesado.</p>
      </div>
      <Button
        label="Reintentar"
        className={`${styles.buttonCustom} p-button-primary`}
      />
    </section>
  );
}
