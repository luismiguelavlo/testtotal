"use client";
import { Button } from "primereact/button";
import styles from "./PaymentsSummaryFooter.module.scss";
import { Checkbox } from "primereact/checkbox";
import { useEffect, useState } from "react";
import { useCheckout } from "../../../../hooks/useCheckout";
import Loading from "../../../../components/commons/loading/Loading";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { useRouter } from "next/navigation";
import CustomAlert from "../../../../components/commons/custom-alert/CustomAlert";
import { useGetToken } from "../../../../hooks/useGetToken";
import { Dialog } from "primereact/dialog";
import posthog from "posthog-js";
import * as Sentry from "@sentry/nextjs";
import ConfirmationPopUp from "../../../../components/commons/confirmation-pop-up/ConfirmationPopUp";

interface Props {
  username: string;
  password: string;
  url: string;
}

const PaymentsSummaryFooter = ({ username, password, url }: Props) => {
  const [checked, setChecked] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [policyDialogVisible, setPolicyDialogVisible] = useState(false);
  const [dataProcessingDialogVisible, setDataProcessingDialogVisible] =
    useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const { isLoading, generateCheckout } = useCheckout();
  const { getToken } = useGetToken();
  const {
    paymentSumary,
    clientEmail,
    paymentDataSCI,
    validitiesMunicipalities,
    validities,
  } = useSelector((state: RootState) => state.validity);
  const router = useRouter();
  const [showPlateConfirmation, setShowPlateConfirmation] = useState(false);
  //const { parameters } = useSelector((state: RootState) => state.validity);

  useEffect(() => {
    if (paymentSumary.total <= 0) {
      router.push("/");
    }
  }, [paymentSumary]);

  /*useEffect(() => {
    if (parameters.idParametro === 0) {
      router.push("/");
    }
    if (parameters.idClientSci === 0) {
      router.push("/");
    }
  }, [parameters.idParametro, parameters.idClientSci]);*/

  const validateEmail = (email: string) => {
    const emailRegex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    return emailRegex.test(email);
  };

  const handlePlateConfirmation = () => {
    setShowPlateConfirmation(false);
    handlePaymentProcess();
  };

  const handleGenerateCheckout = async () => {
    // Mostrar confirmación de placa antes de validaciones
    setShowPlateConfirmation(true);
  };

  const handlePaymentProcess = async () => {
    if (clientEmail.length === 0) {
      posthog.capture("checkout_validation_error", {
        errorType: "empty_email",
        step: "payment_summary",
      });

      setAlertTitle("Correo electrónico requerido");
      setAlertMessage(
        "Por favor ingresa tu correo electrónico para continuar con el pago."
      );
      setShowAlert(true);
      return;
    }

    if (!validateEmail(clientEmail)) {
      posthog.capture("checkout_validation_error", {
        errorType: "invalid_email",
        step: "payment_summary",
        email: clientEmail.split("@")[1] || "unknown",
      });

      setAlertTitle("Correo electrónico inválido");
      setAlertMessage(
        "Por favor ingresa un correo electrónico válido para continuar con el pago."
      );
      setShowAlert(true);
      return;
    }

    const token = await getToken({
      username: username,
      password: password,
    });

    let dataToSendSCI = paymentDataSCI
      ? {
          ...paymentDataSCI,
          email: clientEmail,
          valorTotal: `${paymentSumary.total}`,
        }
      : null;

    if (!dataToSendSCI) {
      posthog.capture("checkout_error", {
        errorType: "missing_payment_data",
        step: "payment_summary",
      });

      setAlertTitle("Error en el proceso de pago");
      setAlertMessage(
        "No se encontraron datos de pago. Serás redirigido a la página principal."
      );
      setShowAlert(true);

      setTimeout(() => {
        router.push("/");
      }, 5000);
      return;
    }

    posthog.capture("payment_initiated", {
      amount: paymentSumary.total,
      hasEmail: !!clientEmail,
      emailDomain: clientEmail.split("@")[1] || "unknown",
    });

    if (dataToSendSCI.dispersion.length <= 0) {
      const error = new Error("Dispersión vacía en proceso de pago");
      Sentry.captureException(error, {
        extra: {
          paymentData: dataToSendSCI,
          email: clientEmail,
          total: paymentSumary.total,
        },
      });

      posthog.capture("payment_error", {
        errorType: "empty_dispersion",
        step: "payment_summary",
      });

      setAlertTitle(
        "Error en el proceso de pago, realice el pago nuevamente o contacte a soporte"
      );
      setTimeout(() => {
        router.push("/");
      }, 15000);
      return;
    }

    // Add validation for required fields in dispersion
    const hasInvalidDispersion = dataToSendSCI.dispersion.some(
      (item) => !item.palabraClave || !item.referencia || !item.valor
    );

    if (hasInvalidDispersion) {
      const error = new Error(
        "Datos de dispersión inválidos en proceso de pago"
      );
      Sentry.captureException(error, {
        extra: {
          paymentData: dataToSendSCI,
          invalidDispersionData: dataToSendSCI.dispersion.filter(
            (item) => !item.palabraClave || !item.referencia || !item.valor
          ),
          email: clientEmail,
          total: paymentSumary.total,
        },
      });

      posthog.capture("payment_error", {
        errorType: "invalid_dispersion_data",
        step: "payment_summary",
      });

      setAlertTitle(
        "Error en los datos de pago, realice el pago nuevamente o contacte a soporte"
      );
      setShowAlert(true);
      setTimeout(() => {
        router.push("/");
      }, 15000);
      return;
    }

    // Add new validation for total amount matching dispersion values
    const dispersionsTotal = dataToSendSCI.dispersion.reduce((sum, item) => {
      return sum + Number(item.valor);
    }, 0);

    if (dispersionsTotal !== Number(dataToSendSCI.valorTotal)) {
      posthog.capture("payment_error", {
        errorType: "dispersion_total_mismatch",
        step: "payment_summary",
        expected: Number(dataToSendSCI.valorTotal),
        actual: dispersionsTotal,
      });

      setAlertTitle("Error en los montos de pago");
      setAlertMessage(
        "Los montos de pago no coinciden. Por favor, intente nuevamente o contacte a soporte."
      );
      setShowAlert(true);
      setTimeout(() => {
        router.push("/");
      }, 15000);
      return;
    }

    const response = await generateCheckout(dataToSendSCI, token);

    if (response) {
      posthog.capture("payment_checkout_generated", {
        amount: paymentSumary.total,
        success: true,
      });

      window.location.href = response;
    } else {
      posthog.capture("payment_checkout_error", {
        errorType: "generate_checkout_failed",
        amount: paymentSumary.total,
      });

      setAlertTitle("Error en el proceso de pago");
      setAlertMessage(
        "No se pudo generar el enlace de pago. Serás redirigido a la página principal."
      );
      setShowAlert(true);

      setTimeout(() => {
        router.push("/");
      }, 5000);
    }
  };

  const showPolicyDialog = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setDialogTitle("Política de Tratamiento de la Información");
    setPolicyDialogVisible(true);
  };

  const showDataProcessingDialog = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setDialogTitle("Autorización para el Tratamiento de Datos Personales");
    setDataProcessingDialogVisible(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className={styles.footerContainer}>
      {showPlateConfirmation && (
        <ConfirmationPopUp
          title="Verificación de placa"
          message="Por favor, verifica las placas ingresadas para continuar con tu proceso de pago de vigencias:"
          value={
            validitiesMunicipalities[0]?.[0]?.plate ||
            validities?.departmentalInformation[0]?.plate ||
            ""
          }
          onAccept={handlePlateConfirmation}
          onCancel={() => setShowPlateConfirmation(false)}
        />
      )}

      <CustomAlert
        show={showAlert}
        message={alertMessage}
        title={alertTitle}
        onClose={() => setShowAlert(false)}
      />

      <Dialog
        header={dialogTitle}
        visible={policyDialogVisible}
        style={{ width: "50vw" }}
        onHide={() => setPolicyDialogVisible(false)}
        className={styles.dialog}
        resizable={false}
      >
        <div className={styles.dialogContent}>
          <p>
            Para ver la Política de Tratamiento de la Información,{" "}
            <a
              href="/pdf/pti_syc_3.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              haz clic aquí
            </a>
          </p>
        </div>
      </Dialog>

      <Dialog
        header={dialogTitle}
        visible={dataProcessingDialogVisible}
        style={{ width: "50vw" }}
        onHide={() => setDataProcessingDialogVisible(false)}
        className={styles.dialog}
        resizable={false}
      >
        <div className={styles.dialogContent}>
          <p>
            Para ver la Autorización para el Tratamiento de Datos Personales,{" "}
            <a
              href="/pdf/autorizacion_tratamiento_datos_web.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              haz clic aquí
            </a>
          </p>
        </div>
      </Dialog>

      <div className={styles.contentContainer}>
        <div className={styles.checkboxContainer}>
          <Checkbox
            inputId="policy"
            checked={checked}
            onChange={(e) => setChecked(e.checked || false)}
            className={styles.checkbox}
          />
          <label htmlFor="policy" className={styles.policyText}>
            Acepto la{" "}
            <a
              href="#"
              className={styles.policyLink}
              onClick={showPolicyDialog}
            >
              Política de Tratamiento de la Información
            </a>{" "}
            y la{" "}
            <a
              href="#"
              className={styles.policyLink}
              onClick={showDataProcessingDialog}
            >
              Autorización para el Tratamiento de Datos Personales
            </a>
          </label>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            label="Pagar con PSE"
            rounded
            className={styles.payButton}
            disabled={!checked}
            onClick={handleGenerateCheckout}
          />
        </div>
      </div>
    </section>
  );
};

export default PaymentsSummaryFooter;
