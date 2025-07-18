"use client";
import { Card } from "primereact/card";
import styles from "./PaymentsSummaryCard.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

const PaymentsSummaryCard = () => {
  const { paymentSumary } = useSelector((state: RootState) => state.validity);

  return (
    <section className={styles.container}>
      <Card className={styles.summaryCard}>
        <div className={styles.itemsContainer}>
          <div className={styles.item}>
            <div className={styles.itemLabel}>
              Imp. Vehicular ({paymentSumary.quantityVehiclesTax})
            </div>
            <div className={styles.itemValue}>
              $ {paymentSumary.vehicleTax.toLocaleString()}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}>
              Tránsito Municipal ({paymentSumary.quantityMunicipalTransit})
            </div>
            <div className={styles.itemValue}>
              $ {paymentSumary.municipalTransit.toLocaleString()}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}>Interés de mora</div>
            <div className={styles.itemValue}>
              $ {paymentSumary.latePaymentInterest.toLocaleString()}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}>Sanción</div>
            <div className={styles.itemValue}>
              $ {paymentSumary.sanction.toLocaleString()}
            </div>
          </div>
          <div className={styles.item}>
            <div className={`${styles.itemLabel} ${styles.discount}`}>
              Descuento ({paymentSumary.quantityDiscount})
            </div>
            <div className={`${styles.itemValue} ${styles.discount}`}>
              $ {paymentSumary.discount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className={styles.totalContainer}>
          <div className={styles.totalLabel}>TOTAL</div>
          <div className={styles.totalValue}>
            $ {paymentSumary.total.toLocaleString()}
          </div>
        </div>
      </Card>
      <p className={styles.municipalTransitInfo}>
        {paymentSumary.quantityMunicipalTransit > 0 && (
          <span>
            El valor a pagar de Tránsito Municipal incluye el uso voluntario de
            la plataforma Total ($8,600 c/u).
          </span>
        )}
      </p>
    </section>
  );
};

export default PaymentsSummaryCard;
