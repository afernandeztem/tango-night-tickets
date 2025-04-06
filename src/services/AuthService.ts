import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { NavigateFunction } from 'react-router-dom';
import { DEFAULT_HEADERS, AUTH_ENDPOINTS, REQUEST_CONFIG } from '../constants/services';
import { ErrorResponseWithDescription } from '../models/Api';
import { ERROR_AUTH_SERVICE_MESSAGES } from '../constants/messages';
import { encrypt, decrypt } from '../utils/encrypt';
import TokenManager, { LAST_REFRESH_KEY } from './TokenManager';

interface JWTPayload {
  exp: number;
  iat: number;
  sub: string;
  [key: string]: unknown;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export interface IAuthService {
  getInstance(): AxiosInstance;
  setNavigate(navigate: NavigateFunction): void;
  validateToken(): Promise<boolean>;
  logout(): Promise<void>;
  initialize(): Promise<void>;
}

class AuthService implements IAuthService {
  private static readonly TOKEN_CHECK_INTERVAL = 300000;
  private static readonly TOKEN_EXPIRY_MARGIN = 600;

  private readonly instance: AxiosInstance;
  private readonly tokenManager: typeof TokenManager;
  private refreshSubscribers: Array<(token: string) => void>;

  private navigate: NavigateFunction | null;
  private isRefreshing: boolean;
  private isInitialized: boolean;
  private initializationPromise: Promise<void> | null;

  constructor() {
    console.info('Initializing auth service...');
    this.instance = axios.create({
      baseURL: 'https://api.grupotangoapp.com',
      headers: DEFAULT_HEADERS,
      timeout: REQUEST_CONFIG.TIMEOUT,
    });
    this.tokenManager = TokenManager;
    this.navigate = null;
    this.isRefreshing = false;
    this.isInitialized = false;
    this.initializationPromise = null;
    this.refreshSubscribers = [];

    this.setupInterceptors();
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }

  private setupInterceptors(): void {
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private setupRequestInterceptor(): void {
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (config.url?.includes('/oauth/token')) {
          return config;
        }

        const accessToken = this.tokenManager.getAccessToken();
        if (accessToken && this.isTokenValid(accessToken)) {
          config.headers.Authorization = `Bearer ${accessToken}`;
          return config;
        }

        if (!this.isInitialized && !this.initializationPromise) {
          this.initializationPromise = this.initializeFromStorage().finally(() => {
            this.initializationPromise = null;
          });
          await this.initializationPromise;
        }

        const currentToken = this.tokenManager.getAccessToken();
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  private setupResponseInterceptor(): void {
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as CustomRequestConfig | undefined;

        if (!config || error.response?.status !== 401 || config._retry) {
          return Promise.reject(error);
        }
        return this.handleUnauthorizedError(error);
      }
    );
  }

  private async handleUnauthorizedError(error: AxiosError): Promise<unknown> {
    if (
      error.response?.data &&
      typeof error.response.data === 'object' &&
      'error' in error.response.data &&
      'error_description' in error.response.data
    ) {
      const errorData = error.response.data as ErrorResponseWithDescription;
      if (
        errorData.error === 'unauthorized' &&
        errorData.error_description?.includes('User not found')
      ) {
        return Promise.reject(new Error(errorData.error_description));
      }
    }

    const originalRequest = error.config as CustomRequestConfig;
    originalRequest._retry = true;

    if (this.isRefreshing) {
      return this.waitForRefresh(originalRequest);
    }

    this.isRefreshing = true;

    try {
      const refreshToken = this.tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error(ERROR_AUTH_SERVICE_MESSAGES.ERROR_NO_REFRESH_TOKEN);
      }

      const success = await this.handleTokenRefresh(refreshToken);
      if (success) {
        return this.retryRequestWithNewToken(originalRequest);
      }
      throw new Error(ERROR_AUTH_SERVICE_MESSAGES.ERROR_FAILED_TO_REFRESH_TOKEN);
    } catch (error) {
      console.error(
        ERROR_AUTH_SERVICE_MESSAGES.ERROR_HANDLING_UNAUTHORIZED_REQUEST,
        (error as Error).message
      );
      this.handleRefreshError();
      return Promise.reject(error);
    }
  }

  private async waitForRefresh(originalRequest: CustomRequestConfig): Promise<unknown> {
    try {
      const token = await new Promise<string>((resolve) => {
        this.refreshSubscribers.push(resolve);
      });
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return this.instance(originalRequest);
    } catch (error) {
      console.error(
        ERROR_AUTH_SERVICE_MESSAGES.ERROR_WAITING_FOR_TOKEN_REFRESH,
        (error as Error).message
      );
      return Promise.reject(error);
    }
  }

  private async retryRequestWithNewToken(originalRequest: CustomRequestConfig): Promise<unknown> {
    const newToken = this.tokenManager.getAccessToken();
    this.refreshSubscribers.forEach((callback) => callback(newToken!));
    this.refreshSubscribers = [];
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return this.instance(originalRequest);
  }

  protected handleRefreshError(): void {
    this.refreshSubscribers = [];
    this.logout();
  }

  public setNavigate(navigate: NavigateFunction): void {
    this.navigate = navigate;
  }

  public async validateToken(): Promise<boolean> {
    try {
      const accessToken = this.tokenManager.getAccessToken();
      const refreshToken = this.tokenManager.getRefreshToken();

      if (!accessToken && !refreshToken) {
        console.info('Token validation result: false (no tokens)');
        return false;
      }

      if (accessToken) {
        if (this.isTokenValid(accessToken)) {
          console.info('Token validation result: true (valid access token)');
          return true;
        }
        if (refreshToken) {
          const result = await this.handleTokenRefresh(refreshToken);
          console.info(`Token validation result: ${result} (refreshed with refresh token)`);
          return result;
        }
        console.info('Token validation result: false (invalid access token, no refresh token)');
        return false;
      }

      if (refreshToken) {
        const result = await this.handleTokenRefresh(refreshToken);
        console.info(`Token validation result: ${result} (using only refresh token)`);
        return result;
      }

      console.info('Token validation result: false (no conditions met)');
      return false;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  private async initializeFromStorage(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      const accessToken = this.tokenManager.getAccessToken();
      if (accessToken && this.isTokenValid(accessToken)) {
        this.isInitialized = true;
        return;
      }

      const refreshToken = this.tokenManager.getRefreshToken();
      if (!refreshToken) {
        this.isInitialized = true;
        return;
      }

      if (!this.isRefreshing) {
        await this.handleTokenRefresh(refreshToken);
      }
    } catch (error) {
      console.error(
        ERROR_AUTH_SERVICE_MESSAGES.ERROR_INITIALIZING_FROM_STORAGE,
        (error as Error).message
      );
    } finally {
      this.isInitialized = true;
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      const tokenData = this.parseJwt(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return tokenData.exp > currentTime + AuthService.TOKEN_EXPIRY_MARGIN;
    } catch {
      return false;
    }
  }

  private parseJwt(token: string): JWTPayload {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) throw new Error(ERROR_AUTH_SERVICE_MESSAGES.ERROR_INVALID_TOKEN_FORMAT);

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error(ERROR_AUTH_SERVICE_MESSAGES.ERROR_PARSING_JWT, (error as Error).message);
      throw new Error(ERROR_AUTH_SERVICE_MESSAGES.ERROR_INVALID_TOKEN);
    }
  }

  private async handleTokenRefresh(refreshToken: string): Promise<boolean> {
    if (!refreshToken) {
      throw new Error(ERROR_AUTH_SERVICE_MESSAGES.ERROR_NO_REFRESH_TOKEN);
    }

    try {
      if (this.isRefreshing) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return true;
      }

      const accessToken = this.tokenManager.getAccessToken();
      const shouldRefresh = !accessToken || !this.isTokenValid(accessToken);

      if (shouldRefresh || this.shouldPerformPeriodicRefresh()) {
        this.isRefreshing = true;
        return await this.refreshToken(refreshToken);
      }

      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      if (
        (error as AxiosError)?.response?.status === 400 ||
        (error as AxiosError)?.response?.status === 500
      ) {
        this.tokenManager.clearTokens();
        localStorage.removeItem(LAST_REFRESH_KEY);
      }
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  private shouldPerformPeriodicRefresh(): boolean {
    const lastRefresh = localStorage.getItem(LAST_REFRESH_KEY);
    if (!lastRefresh) return true;

    const timeSinceLastRefresh = Date.now() - parseInt(lastRefresh);
    return timeSinceLastRefresh >= AuthService.TOKEN_CHECK_INTERVAL;
  }

  private async refreshToken(refreshToken: string): Promise<boolean> {
    try {
      const response = await this.instance.post<TokenResponse>(
        AUTH_ENDPOINTS.TOKEN,
        new URLSearchParams({
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
        {
          headers: {
            Authorization: `Basic YXBwLW1vYmlsZTpzZWNyZXQ=`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          _retry: true,
        } as CustomRequestConfig
      );

      const { access_token, refresh_token } = response.data;
      if (access_token && refresh_token) {
        const rememberMe = document.cookie.includes('app_rt=');
        this.tokenManager.setTokens(access_token, refresh_token, rememberMe);

        localStorage.setItem(LAST_REFRESH_KEY, Date.now().toString());
        return true;
      }
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  private clearLastRefresh(): void {
    localStorage.removeItem(LAST_REFRESH_KEY);
  }

  public async logout(): Promise<void> {
    this.clearLastRefresh();
    this.tokenManager.clearTokens();
    if (window.location.pathname !== '/auth') {
      if (this.navigate) {
        await Promise.resolve(this.navigate('/auth'));
      } else {
        window.location.href = '/auth';
      }
    }
  }

  public async initialize(): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeFromStorage();
    }
  }
}

export default new AuthService() as IAuthService;
