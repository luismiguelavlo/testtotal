"use client";
import { InputText } from "primereact/inputtext";
import styles from "./PaymentsSummaryForm.module.scss";
import { useState } from "react";
import { setClientEmail } from "../../../../store/validities/validitySlice";
import { useDispatch } from "react-redux";
import { validateEmail, sanitizeEmail } from "@/utils/security";

const PaymentsSummaryForm = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const dispatch = useDispatch();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    const sanitizedEmail = sanitizeEmail(rawInput);
    setEmail(sanitizedEmail);
    setIsValidEmail(validateEmail(sanitizedEmail));
  };

  const handleSubmit = () => {
    if (isValidEmail && email) {
      dispatch(setClientEmail(email));
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>
        Ingresa un correo para recibir soportes de pago
      </p>
      <div className={styles.formContainer}>
        <InputText
          className={`${styles.input} ${
            !isValidEmail && email ? styles.invalid : ""
          }`}
          placeholder="Correo electrónico"
          value={email}
          onChange={handleEmailChange}
          onBlur={handleSubmit}
          type="email"
          maxLength={254}
        />
        {!isValidEmail && email && (
          <small className={styles.errorMessage}>
            Por favor ingresa un correo electrónico válido
          </small>
        )}
      </div>
    </div>
  );
};

export default PaymentsSummaryForm;
