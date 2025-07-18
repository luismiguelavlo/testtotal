"use client";
import React, { useEffect } from "react";
import { Button } from "primereact/button";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";

export default function page() {
  const router = useRouter();
  // Función para generar un número aleatorio en un rango
  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  // Función para disparar el confeti
  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  // Disparar el confeti cuando el componente se monte
  useEffect(() => {
    triggerConfetti();

    // Redireccionar al inicio después de 5 segundos
    const redirectTimer = setTimeout(() => {
      router.push("/");
    }, 5000);

    // Limpiar el timer si el componente se desmonta antes de los 5 segundos
    return () => clearTimeout(redirectTimer);
  }, []);
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <img src="/imgs/success.webp" alt="Success Payment" />
        <h2>¡Hemos recibido tu pago!</h2>
        <p>
          Enviamos a tu correo todos los documentos, declaraciones y detalles de
          pago.
        </p>
      </div>
      <Button
        label="Salir al inicio"
        className={`${styles.buttonCustom} p-button-secondary`}
        // También puedes disparar el confeti al hacer clic en el botón si lo deseas
        // onClick={triggerConfetti}
      />
    </section>
  );
}
