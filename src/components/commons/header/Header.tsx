"use client";
import { Button } from "primereact/button";
import styles from "./Header.module.scss";
const Header = ({ showBtnConsultation }: { showBtnConsultation: boolean }) => {
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
        <img src="/imgs/total-logo.svg" alt="Total Logo" />

        {showBtnConsultation && (
          <Button
            className={`${styles.buttonCustom} p-button-secondary`}
            label="Soporte"
            outlined
            rounded
            onClick={redirectToGobernacion}
          />
        )}
      </section>
    </header>
  );
};

export default Header;
