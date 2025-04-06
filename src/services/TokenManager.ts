
// Simple encryption/decryption functions
// Note: In a production app, you should use a proper encryption library
const encrypt = (text: string): string => {
  try {
    return btoa(text);
  } catch (e) {
    return text;
  }
};

const decrypt = (text: string): string => {
  try {
    return atob(text);
  } catch (e) {
    return text;
  }
};

export const LAST_REFRESH_KEY = 'last_refresh';

class TokenManager {
    private static instance: TokenManager;
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private readonly REFRESH_TOKEN_KEY = 'app_rt';
    private readonly ACCESS_TOKEN_KEY = 'app_at';
    private readonly REMEMBER_ME_DURATION = 10 * 24 * 60 * 60;
    private readonly TOKEN_KEY = 'authToken';
    private readonly LEGACY_TOKEN_KEY = 'token'; // For backward compatibility

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
        console.log(`Setting tokens: accessToken length: ${accessToken.length}, rememberMe: ${rememberMe}`);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;

        // Access Token always encrypted in sessionStorage
        const encryptedAccessToken = encrypt(accessToken);
        sessionStorage.setItem(this.ACCESS_TOKEN_KEY, encryptedAccessToken);
        
        // Also set in localStorage for compatibility with existing code
        localStorage.setItem(this.LEGACY_TOKEN_KEY, accessToken);

        // Refresh Token
        const encryptedRefreshToken = encrypt(refreshToken);
        if (rememberMe) {
            // If rememberMe, store in cookie (encrypted)
            const secure = window.location.protocol === 'https:';
            document.cookie = `${this.REFRESH_TOKEN_KEY}=${encryptedRefreshToken}; path=/; ${
                secure ? 'secure;' : ''
            } samesite=strict; max-age=${this.REMEMBER_ME_DURATION}`;
            console.log(`Cookie set with refresh token. Secure: ${secure}`);
        } else {
            // If not rememberMe, store in sessionStorage (encrypted)
            sessionStorage.setItem(this.REFRESH_TOKEN_KEY, encryptedRefreshToken);
            console.log(`Session storage set with refresh token`);
        }
    }

    private getAccessTokenFromStorage(): string | null {
        try {
            // First try sessionStorage
            const encryptedToken = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
            if (encryptedToken) {
                return decrypt(encryptedToken);
            }
            
            // Then try localStorage for backward compatibility
            const legacyToken = localStorage.getItem(this.LEGACY_TOKEN_KEY);
            return legacyToken;
        } catch (e) {
            console.error('Error getting access token from storage:', e);
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
        } catch (e) {
            console.error('Error getting refresh token from storage:', e);
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
        console.log('Clearing all tokens from storage and cookies');
        this.accessToken = null;
        this.refreshToken = null;
        sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
        sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.LEGACY_TOKEN_KEY);
        localStorage.removeItem('user');

        // Clear the last_refresh from localStorage
        localStorage.removeItem(LAST_REFRESH_KEY);

        // Clear cookie
        document.cookie = `${this.REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; secure; samesite=strict`;
    }

    setToken(token: string): void {
        const encryptedToken = encrypt(token);
        localStorage.setItem(this.TOKEN_KEY, encryptedToken);
        localStorage.setItem(this.LEGACY_TOKEN_KEY, token); // For backward compatibility
    }

    getToken(): string | null {
        // First try from our encrypted token
        const encryptedToken = localStorage.getItem(this.TOKEN_KEY);
        if (encryptedToken) {
            return decrypt(encryptedToken);
        }
        
        // Then try legacy token for backward compatibility
        return localStorage.getItem(this.LEGACY_TOKEN_KEY);
    }
}

export default TokenManager.getInstance();
