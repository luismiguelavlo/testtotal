interface ErrorResponse {
  status: number;
  message: string;
  data?: any;
}

export const handleError = (error: any): ErrorResponse => {
  const defaultMessage = "Ocurrió un error, por favor intenta más tarde.";

  if (error?.status) {
    switch (error.status) {
      case 400:
        return {
          status: error.status,
          message: error.response?.data?.message || "Solicitud inválida.",
        };
      case 401:
        return {
          status: error.status,
          message:
            error.response?.data?.message || "No autorizado. Inicia sesión.",
        };
      case 403:
        return {
          status: error.status,
          message: "No tienes permiso para realizar esta acción.",
        };
      case 404:
        return {
          status: error.status,
          message: "El recurso solicitado no fue encontrado.",
        };
      case 500:
        return {
          status: error.status,
          message: "Error del servidor. Intenta más tarde.",
        };
      default:
        return {
          status: error.status,
          message: defaultMessage,
        };
    }
  }

  return {
    status: 0,
    message: defaultMessage,
  };
};
