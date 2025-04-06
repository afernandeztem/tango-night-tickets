
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly LEGACY_TOKEN_KEY = 'token'; // For backward compatibility

  public getAccessToken(): string | null {
    // Try getting the token from both possible storage keys for compatibility
    return localStorage.getItem(TokenManager.ACCESS_TOKEN_KEY) || 
           localStorage.getItem(TokenManager.LEGACY_TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(TokenManager.REFRESH_TOKEN_KEY) || this.getRefreshTokenFromCookie();
  }

  public setTokens(accessToken: string, refreshToken: string, rememberMe: boolean = false): void {
    localStorage.setItem(TokenManager.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(TokenManager.LEGACY_TOKEN_KEY, accessToken); // For backward compatibility
    localStorage.setItem(TokenManager.REFRESH_TOKEN_KEY, refreshToken);

    console.log('Tokens stored in localStorage. Access token length:', accessToken.length);

    if (rememberMe) {
      // Set refresh token as cookie with 30 days expiry
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `app_rt=${refreshToken}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict; Secure`;
    }
  }

  public clearTokens(): void {
    localStorage.removeItem(TokenManager.ACCESS_TOKEN_KEY);
    localStorage.removeItem(TokenManager.REFRESH_TOKEN_KEY);
    localStorage.removeItem(TokenManager.LEGACY_TOKEN_KEY);
    localStorage.removeItem('user');
    
    // Clear cookie if exists
    document.cookie = `app_rt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure`;
  }

  private getRefreshTokenFromCookie(): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'app_rt') {
        return value;
      }
    }
    return null;
  }
}

export default new TokenManager();
