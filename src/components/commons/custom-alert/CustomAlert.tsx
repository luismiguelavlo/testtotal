import React, { useState, useEffect } from "react";
import styles from "./CustomAlert.module.scss";
import "animate.css";

interface CustomAlertProps {
  show: boolean;
  message: string;
  title?: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
  type?: "error" | "success";
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  show,
  message,
  title = "Vigencia en conflicto",
  onClose,
  autoClose = true,
  autoCloseTime = 15000,
  type = "error",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("animate__fadeIn");

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setAnimationClass("animate__fadeIn");

      if (autoClose) {
        const timer = setTimeout(() => {
          handleAutoClose();
        }, autoCloseTime);

        return () => clearTimeout(timer);
      }
    }
  }, [show, autoClose, autoCloseTime]);

  const handleAutoClose = () => {
    setAnimationClass("animate__fadeOut");
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 500); // Reducido a 500ms para la animación de cierre
  };

  const handleClose = () => {
    setAnimationClass("animate__fadeOut");
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 500); // Reducido a 500ms para la animación de cierre
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Solo cerrar si el click fue directamente en el overlay y no en sus hijos
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  const alertContentClass =
    type === "success" ? styles.alertContentSuccess : styles.alertContent;
  const alertTitleClass =
    type === "success" ? styles.alertTitleSuccess : styles.alertTitle;

  return (
    <div className={styles.alertOverlay} onClick={handleOverlayClick}>
      <div
        className={`${styles.alertContainer} animate__animated ${animationClass} animate__faster`}
      >
        <div className={alertContentClass}>
          <div className={styles.alertHeader}>
            <div className={alertTitleClass}>{title}</div>
            <button className={styles.closeButton} onClick={handleClose}>
              <i className="pi pi-times"></i>
            </button>
          </div>
          <div className={styles.alertMessage}>{message}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
