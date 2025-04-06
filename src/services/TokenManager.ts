
import { encrypt, decrypt } from '../utils/encrypt';

// Define this constant here instead of importing it
export const LAST_REFRESH_KEY = 'last_refresh';

class TokenManager {
  private static instance: TokenManager;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private readonly REFRESH_TOKEN_KEY = 'app_rt';
  private readonly ACCESS_TOKEN_KEY = 'app_at';
  private readonly REMEMBER_ME_DURATION = 10 * 24 * 60 * 60;
  private readonly TOKEN_KEY = 'authToken';

  private constructor() {
    this.refreshToken = this.getRefreshTokenFromCookie();
    this.accessToken = this.getAccessTokenFromStorage();
  }

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  setTokens(accessToken: string, refreshToken: string, rememberMe: boolean = false): void {
    console.log('TokenManager: Setting tokens', { accessToken: accessToken.substring(0, 10) + '...', refreshToken: refreshToken.substring(0, 10) + '...', rememberMe });
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    // Access Token siempre encriptado en sessionStorage
    const encryptedAccessToken = this.encrypt(accessToken);
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, encryptedAccessToken);

    // Refresh Token
    const encryptedRefreshToken = this.encrypt(refreshToken);
    if (rememberMe) {
      // Si es rememberMe, va en cookie (encriptado)
      const secure = window.location.protocol === 'https:';
      document.cookie = `${this.REFRESH_TOKEN_KEY}=${encryptedRefreshToken}; path=/; ${
        secure ? 'secure;' : ''
      } samesite=strict; max-age=${this.REMEMBER_ME_DURATION}`;
    } else {
      // Si no es rememberMe, va en sessionStorage (encriptado)
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, encryptedRefreshToken);
    }
  }

  private getAccessTokenFromStorage(): string | null {
    try {
      const encryptedToken = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
      if (!encryptedToken) return null;
      return decrypt(encryptedToken);
    } catch {
      return null;
    }
  }

  private getRefreshTokenFromCookie(): string | null {
    try {
      const cookies = document.cookie.split(';');
      const refreshTokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith(`${this.REFRESH_TOKEN_KEY}=`)
      );

      if (!refreshTokenCookie) {
        return this.getRefreshTokenFromStorage();
      }

      const encryptedToken = refreshTokenCookie.split('=')[1]?.trim();
      if (!encryptedToken) {
        return this.getRefreshTokenFromStorage();
      }

      try {
        const decryptedToken = decrypt(encryptedToken);
        if (!decryptedToken) {
          this.clearTokens();
          return null;
        }
        return decryptedToken;
      } catch (error) {
        console.error('Error decrypting refresh token:', error);
        this.clearTokens();
        return null;
      }
    } catch (error) {
      console.error('Error reading refresh token from cookie:', error);
      return null;
    }
  }

  private getRefreshTokenFromStorage(): string | null {
    try {
      const encryptedToken = sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
      if (!encryptedToken) return null;
      return decrypt(encryptedToken);
    } catch {
      return null;
    }
  }

  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = this.getAccessTokenFromStorage();
    }
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    if (!this.refreshToken) {
      this.refreshToken = this.getRefreshTokenFromCookie();
    }
    return this.refreshToken;
  }

  clearTokens(): void {
    console.log('TokenManager: Clearing tokens');
    this.accessToken = null;
    this.refreshToken = null;
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);

    // Limpiar el last_refresh del localStorage
    localStorage.removeItem(LAST_REFRESH_KEY);

    // Limpiar cookie
    document.cookie = `${this.REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; secure; samesite=strict`;
  }

  setToken(token: string): void {
    const encryptedToken = this.encrypt(token);
    localStorage.setItem(this.TOKEN_KEY, encryptedToken);
  }

  getToken(): string | null {
    const encryptedToken = localStorage.getItem(this.TOKEN_KEY);
    if (!encryptedToken) return null;
    return this.decrypt(encryptedToken);
  }

  private encrypt(token: string): string {
    return encrypt(token);
  }

  private decrypt(encryptedToken: string): string {
    return decrypt(encryptedToken);
  }
}

export default TokenManager.getInstance();
