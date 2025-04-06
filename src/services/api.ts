import axios from 'axios';
import { User, AuthResponse, TokenResponseDto } from '@/models/Api';
import TokenManager from './TokenManager';
import AuthService from './AuthService';

// Base API URL
const API_URL = import.meta.env.VITE_API_URL || 'https://api.grupotangoapp.com';

// Client credentials for Basic Auth
const CLIENT_CREDENTIALS = import.meta.env.VITE_CLIENT_CREDENTIALS || 'Y2xpZW50OkRhbXh4S1VxSUxOZ1M1enVTQmVqTXQ4S3lkNGh1NkNMbU5MV2dvc290d1Fkb25jT0Uy';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = TokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login(email: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> {
  try {
    console.log('Login attempt with:', email);
    
    // Create form data for OAuth token request
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    formData.append('grant_type', 'password');
    
    // Log the client credentials being used (partially masked)
    const maskedCredentials = CLIENT_CREDENTIALS.substring(0, 8) + '...' + CLIENT_CREDENTIALS.substring(CLIENT_CREDENTIALS.length - 8);
    console.log('Using client credentials:', maskedCredentials);
    
    const response = await axios.post<TokenResponseDto>(
      `${API_URL}/oauth/token`,
      formData,
      {
        headers: {
          'Authorization': `Basic ${CLIENT_CREDENTIALS}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    console.log('OAuth token response received:', response.status);
    
    if (response.data && response.data.access_token) {
      // Store tokens
      TokenManager.setTokens(response.data.access_token, response.data.refresh_token, rememberMe);
      
      // Fetch user info with the new token
      const userResponse = await axios.get(`${API_URL}/api/users/self`, {
        headers: {
          'Authorization': `Bearer ${response.data.access_token}`
        }
      });
      
      const user: User = userResponse.data;
      
      return {
        token: response.data.access_token,
        user
      };
    }
    
    throw new Error('Invalid response from server');
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Server response:', error.response.data);
      throw new Error(error.response.data.error_description || 'Authentication failed');
    }
    throw error;
  }
}

export async function register(data: { name: string; email: string; password: string; phone?: string }): Promise<User> {
  try {
    const response = await api.post('/public/new_user', data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const token = TokenManager.getAccessToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    const response = await api.get('/api/users/self');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
}

export async function toggleFavorite(type: 'local' | 'event', id: string): Promise<User> {
  try {
    const response = await api.post(`/api/users/self/favorites/${type}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error toggling ${type} favorite:`, error);
    throw error;
  }
}
