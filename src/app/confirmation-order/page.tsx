import React from "react";
import styles from "./page.module.scss";
import PaymentsSummaryForm from "./_components/payment-sumary-form/PaymentsSummaryForm";
import PaymentsSummaryCard from "./_components/payment-sumary-card/PaymentsSummaryCard";
import PaymentsSummaryFooter from "./_components/payment-sumary-footer/PaymentsSummaryFooter";

export default function Page() {
  return (
    <>
      <section className={styles.paymentsSummaryFormContainer}>
        <PaymentsSummaryForm />
      </section>
      <section className={styles.paymentsSummaryCardContainer}>
        <PaymentsSummaryCard />
      </section>
      <section className={styles.paymentsSummaryFooterContainer}>
        <PaymentsSummaryFooter
          password={process.env.PAPI || ""}
          username={process.env.UAPI || ""}
          url={process.env.TOTAL_SCI_API_URL || ""}
        />
      </section>
    </>
  );
}
