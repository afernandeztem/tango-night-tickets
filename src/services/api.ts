
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

// Additional functions needed for other components
// Cities
export async function getCities() {
  try {
    const response = await api.get('/api/cities');
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

// Events
export async function getEvents(params: { 
  city?: string; 
  startDate?: string; 
  endDate?: string; 
  search?: string;
  relevant?: boolean;
  size?: number;
  page?: number;
}) {
  try {
    const response = await api.get('/api/events', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return { content: [] };
  }
}

export async function getEventById(id: string) {
  try {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw error;
  }
}

export async function getEventTicketOffers(eventId: string) {
  try {
    const response = await api.get(`/api/events/${eventId}/tickets`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event ticket offers:', error);
    return [];
  }
}

export async function getEventsByLocalId(localId: string) {
  try {
    const response = await api.get(`/api/locals/${localId}/events`);
    return response.data;
  } catch (error) {
    console.error('Error fetching events by local:', error);
    return { content: [] };
  }
}

// Locals
export async function getLocals(params: { 
  city?: string; 
  search?: string;
  relevant?: boolean;
  page?: number;
  size?: number;
}) {
  try {
    const response = await api.get('/api/locals', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching locals:', error);
    return { content: [] };
  }
}

export async function getLocalById(id: string) {
  try {
    const response = await api.get(`/api/locals/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching local details:', error);
    throw error;
  }
}

export async function getFavoriteEvents() {
  try {
    const response = await api.get('/api/users/self/favorites/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite events:', error);
    return [];
  }
}

export async function getFavoriteLocals() {
  try {
    const response = await api.get('/api/users/self/favorites/locals');
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite locals:', error);
    return [];
  }
}

// Local related endpoints
export async function getDrinksByLocalId(localId: string) {
  try {
    const response = await api.get(`/api/locals/${localId}/drinks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching drinks for local:', error);
    return [];
  }
}

export async function getLocalOffers(localId: string) {
  try {
    const response = await api.get(`/api/locals/${localId}/offers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching offers for local:', error);
    return [];
  }
}

export async function getLocalReviews(localId: string) {
  try {
    const response = await api.get(`/api/locals/${localId}/reviews`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews for local:', error);
    return { content: [] };
  }
}

// Tickets
export interface CheckoutFormData {
  name: string;
  email: string;
  phone?: string;
}

export async function createTicket(
  eventId: string,
  quantity: number,
  userData: CheckoutFormData
) {
  try {
    const response = await api.post(`/api/events/${eventId}/tickets`, {
      ...userData,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
}

export async function getUserTickets() {
  try {
    const response = await api.get('/api/users/self/tickets');
    return response.data;
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    return [];
  }
}
