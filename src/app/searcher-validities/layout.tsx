"use client";
import Footer from "@/components/commons/footer/Footer";
import styles from "./layout.module.scss";
import React, { Suspense } from "react";
import { Button } from "primereact/button";
import { useRouter, useSearchParams } from "next/navigation";
import { resetValidityState } from "@/store";
import { useDispatch } from "react-redux";
import { capitalizeFirstLetter } from "@/helpers/capitalize-first-letter";

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.stickyLayout}>
      <Header />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
}

export default function SearcherValiditiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}

//this header is just for the searcher-validities page
const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const departmentName = searchParams.get("departmentName");

  const goBack = () => {
    dispatch(resetValidityState());
    router.back();
  };

  const redirectToGobernacion = () => {
    window.open(
      "https://edeskprisma.syc.com.co/SANTANDER?openSupport=true",
      "_blank"
    );
  };
  return (
    <header
      className={`${styles.header} flex justify-content-center align-items-center`}
    >
      <section className="flex justify-content-between align-items-center">
        {/* Logo solo en desktop */}
        <img
          src="/imgs/total-logo.svg"
          alt="Total Logo"
          className={styles.logoDesktop}
        />

        {/* Back y título solo en mobile/tablet */}
        <div className={styles.headerBackContainer}>
          <Button
            icon="pi pi-arrow-left"
            className={`${styles.buttonBackCustom} p-button-secondary mr-3`}
            rounded
            onClick={goBack}
            aria-label="Volver"
          />
          <h2 className={styles.title}>
            Trámites de {capitalizeFirstLetter(departmentName || "")}
          </h2>
        </div>

        <Button
          className={`${styles.buttonCustom} p-button-secondary w-10rem`}
          label="Soporte"
          outlined
          rounded
          onClick={redirectToGobernacion}
        />
      </section>
    </header>
  );
};
