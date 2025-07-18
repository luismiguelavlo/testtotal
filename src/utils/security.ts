// Utilidades de seguridad para aplicación frontend

// Validación de placas de vehículos
export const validatePlate = (plate: string): boolean => {
  const plateRegex = /^[A-Z0-9]{1,10}$/;
  return plateRegex.test(plate.trim().toUpperCase());
};

// Sanitización de entrada de usuario
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Prevenir XSS básico
    .replace(/\s+/g, " ") // Normalizar espacios
    .slice(0, 1000); // Limitar longitud
};

// Validación de email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.toLowerCase().trim());
};

// Sanitización de email
export const sanitizeEmail = (email: string): string => {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9.@_-]/g, "");
};

// Validación de números
export const validateNumber = (value: string): boolean => {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};

// Sanitización de números
export const sanitizeNumber = (value: string): number => {
  const num = Number(value.replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
};

// Validación de URL
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Prevención de XSS en contenido dinámico
export const escapeHtml = (text: string): string => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

// Validación de token JWT (básica)
export const validateToken = (token: string): boolean => {
  if (!token) return false;
  return token.length > 10 && token.length < 1000;
};

// Validación de datos de pago
export const validatePaymentData = (data: any): boolean => {
  if (!data || typeof data !== "object") return false;

  // Validar email
  if (!data.email || !validateEmail(data.email)) return false;

  // Validar valor total
  if (!data.valorTotal || !validateNumber(String(data.valorTotal)))
    return false;

  // Validar dispersión
  if (!Array.isArray(data.dispersion) || data.dispersion.length === 0)
    return false;

  // Validar cada elemento de dispersión
  return data.dispersion.every(
    (item: any) =>
      item.palabraClave &&
      item.referencia &&
      item.valor &&
      validateNumber(String(item.valor))
  );
};

// Rate limiting client-side (básico)
class ClientRateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> =
    new Map();

  canMakeRequest(
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 60000
  ): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (attempt.count >= maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new ClientRateLimiter();

// Validación de entrada de placa con rate limiting
export const validatePlateWithRateLimit = (
  plate: string,
  userId?: string
): { valid: boolean; message?: string } => {
  const key = `plate_validation_${userId || "anonymous"}`;

  if (!rateLimiter.canMakeRequest(key, 10, 60000)) {
    return {
      valid: false,
      message: "Demasiadas consultas. Intenta en 1 minuto.",
    };
  }

  const sanitizedPlate = sanitizeInput(plate);

  if (!sanitizedPlate) {
    return { valid: false, message: "La placa es requerida" };
  }

  if (!validatePlate(sanitizedPlate)) {
    return { valid: false, message: "Formato de placa inválido" };
  }

  return { valid: true };
};

// Validación de credenciales (sin almacenar)
export const validateCredentials = (
  username: string,
  password: string
): boolean => {
  const sanitizedUsername = sanitizeInput(username);
  const sanitizedPassword = sanitizeInput(password);

  return (
    sanitizedUsername.length > 0 &&
    sanitizedUsername.length <= 100 &&
    sanitizedPassword.length > 0 &&
    sanitizedPassword.length <= 100
  );
};

// Prevención de ataques de timing
export const constantTimeComparison = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
};

// Validación de datos sensibles antes de enviar
export const sanitizePaymentData = (data: any): any => {
  if (!data) return null;

  return {
    ...data,
    email: data.email ? sanitizeEmail(data.email) : "",
    valorTotal: data.valorTotal
      ? sanitizeNumber(data.valorTotal).toString()
      : "0",
    dispersion: Array.isArray(data.dispersion)
      ? data.dispersion.map((item: any) => ({
          palabraClave: sanitizeInput(item.palabraClave || ""),
          referencia: sanitizeInput(item.referencia || ""),
          valor: sanitizeNumber(item.valor || 0).toString(),
        }))
      : [],
  };
};
