import styles from "./ConfirmationPopUp.module.scss";

interface ConfirmationPopUpProps {
  title: string;
  message: string;
  onAccept: () => void;
  onCancel: () => void;
  value?: string;
}

const ConfirmationPopUp = ({
  title,
  message,
  onAccept,
  onCancel,
  value,
}: ConfirmationPopUpProps) => {
  return (
    <div className={styles.confirmationPopup}>
      <div className={styles.confirmationPopup__container}>
        <h2 className={styles.confirmationPopup__title}>{title}</h2>
        <p className={styles.confirmationPopup__message}>{message}</p>

        {value && (
          <div className={styles.confirmationPopup__value}>{value}</div>
        )}

        <button
          className={`${styles.confirmationPopup__button} ${styles["confirmationPopup__button--accept"]}`}
          onClick={onAccept}
        >
          Aceptar
        </button>

        <button
          className={`${styles.confirmationPopup__button} ${styles["confirmationPopup__button--cancel"]}`}
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPopUp;
