'use client'
import React from 'react'
import styles from "./not-found.module.scss"
import { useRouter } from "next/navigation";
import Header from '@/components/commons/header/Header';
import Footer from '@/components/commons/footer/Footer';

export default function NotFound() {
  const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
  };
  return (
    <main>
      <Header  showBtnConsultation={true} />
       <div
        className={
          styles.container + " flex flex-col items-center justify-center"
        }
      >
        <h1 className={styles.neonText}>404</h1>
        <h2 className={styles.title}>¡Oops! Página no encontrada</h2>
        <p className={styles.description}>
          Parece que esta página no existe, ha sido eliminada o está
          temporalmente inactiva
        </p>
        <button
          className={`${styles.button} p-button p-button-primary`}
          onClick={() => navigate("/")}
        >
          Regresar al inicio
        </button>
      </div>
      <Footer />
    </main>
   
  )
}
