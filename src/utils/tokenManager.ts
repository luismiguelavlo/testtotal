// Gestor de tokens para aplicación frontend

interface TokenInfo {
  token: string;
  expiresAt: number;
}

class TokenManager {
  private readonly TOKEN_KEY = "totalapp_auth_token";
  private readonly TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutos antes de expirar

  // Almacenar token de forma segura
  setToken(token: string, expiresIn: number = 3600): void {
    try {
      const expiresAt = Date.now() + expiresIn * 1000;
      const tokenInfo: TokenInfo = {
        token,
        expiresAt,
      };

      // Usar sessionStorage para que se borre al cerrar el navegador
      sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenInfo));
    } catch (error) {
      console.error("Error al almacenar token:", error);
    }
  }

  // Obtener token si es válido
  getToken(): string | null {
    try {
      const tokenData = sessionStorage.getItem(this.TOKEN_KEY);
      if (!tokenData) return null;

      const tokenInfo: TokenInfo = JSON.parse(tokenData);

      // Verificar si el token ha expirado
      if (Date.now() >= tokenInfo.expiresAt - this.TOKEN_EXPIRY_BUFFER) {
        this.clearToken();
        return null;
      }

      return tokenInfo.token;
    } catch (error) {
      console.error("Error al obtener token:", error);
      this.clearToken();
      return null;
    }
  }

  // Verificar si el token es válido
  isTokenValid(): boolean {
    return this.getToken() !== null;
  }

  // Limpiar token
  clearToken(): void {
    try {
      sessionStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error("Error al limpiar token:", error);
    }
  }

  // Obtener tiempo restante del token en segundos
  getTokenTimeRemaining(): number {
    try {
      const tokenData = sessionStorage.getItem(this.TOKEN_KEY);
      if (!tokenData) return 0;

      const tokenInfo: TokenInfo = JSON.parse(tokenData);
      const timeRemaining = tokenInfo.expiresAt - Date.now();

      return Math.max(0, Math.floor(timeRemaining / 1000));
    } catch (error) {
      return 0;
    }
  }
}

export const tokenManager = new TokenManager();

// Hook para usar el token manager en componentes
export const useTokenManager = () => {
  return {
    getToken: tokenManager.getToken.bind(tokenManager),
    setToken: tokenManager.setToken.bind(tokenManager),
    clearToken: tokenManager.clearToken.bind(tokenManager),
    isTokenValid: tokenManager.isTokenValid.bind(tokenManager),
    getTokenTimeRemaining:
      tokenManager.getTokenTimeRemaining.bind(tokenManager),
  };
};
