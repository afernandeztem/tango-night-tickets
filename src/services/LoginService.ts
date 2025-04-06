
import { AuthMessage } from '../models/Api';
import axios from 'axios';
import TokenManager from './TokenManager';
import { ERROR_CRUD_MESSAGES } from '../constants/messages';

interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

class LoginService {
  // Login function
  static async login(credentials: LoginCredentials): Promise<AuthMessage> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    formData.append('grant_type', 'password');

    try {
      console.log('LoginService: Attempting login for', credentials.username);
      
      // Using direct axios call to avoid circular dependencies with AuthService
      const response = await axios.post<AuthMessage>(
        'https://api.grupotangoapp.com/oauth/token', 
        formData, 
        {
          headers: {
            Authorization: `Basic YXBwLW1vYmlsZTpzZWNyZXQ=`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      
      console.log('LoginService: Login response received', { 
        status: response.status,
        hasAccessToken: !!response.data.access_token,
        hasRefreshToken: !!response.data.refresh_token
      });
      
      if ('access_token' in response.data && 'refresh_token' in response.data) {
        // Clear any existing tokens before setting new ones
        TokenManager.clearTokens();
        
        // Set the new tokens
        TokenManager.setTokens(
          response.data.access_token,
          response.data.refresh_token,
          credentials.rememberMe
        );
        return response.data;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      console.error('LoginService: Login error', error);
      
      if (error?.response?.data) {
        console.error('Response data:', error.response.data);
        
        if (error.response.data.error_description) {
          throw new Error(error.response.data.error_description);
        }
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(ERROR_CRUD_MESSAGES.ERROR_UNKNOWN_LOGIN);
    }
  }
}

export default LoginService;
