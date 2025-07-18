import Footer from "@/components/commons/footer/Footer";
import Header from "@/components/commons/header/Header";
import React from "react";
import styles from "./layout.module.scss";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.homeLayout}>
      <Header showBtnConsultation={true} />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
}
