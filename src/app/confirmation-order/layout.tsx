import Header from "@/components/commons/header/Header";
import styles from "./layout.module.scss";
import React from "react";
import HeaderBack from "./_components/header-back/HeaderBack";
import Footer from "@/components/commons/footer/Footer";

export default function BackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.stickyLayout}>
      <div className={styles.headerContainer}>
        <Header showBtnConsultation={true} />
      </div>
      <HeaderBack />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
}
