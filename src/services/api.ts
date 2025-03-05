
import axios from 'axios';
import { City, Local, Event, Drink, PaginatedResponse, User, CheckoutFormData } from '../types';

// TODO: Replace with actual API URL
const API_BASE_URL = 'https://api.tangoapp.example.com';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock data for development (remove in production)
const mockData = {
  cities: [
    { id: '1', name: 'Buenos Aires', active: true, country: 'Argentina', image: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?q=80&w=1740&auto=format&fit=crop' },
    { id: '2', name: 'Madrid', active: true, country: 'Spain', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=1740&auto=format&fit=crop' },
    { id: '3', name: 'Barcelona', active: true, country: 'Spain', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1740&auto=format&fit=crop' },
    { id: '4', name: 'New York', active: true, country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1740&auto=format&fit=crop' },
    { id: '5', name: 'Paris', active: true, country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1742&auto=format&fit=crop' },
  ],
};

// API Functions
export const getCities = async (): Promise<City[]> => {
  try {
    // Uncomment for real API
    // const response = await api.get<City[]>('/public/cities');
    // return response.data;
    
    // Mock response
    return mockData.cities;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

export const getLocals = async (
  city?: string,
  relevant?: boolean,
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse<Local>> => {
  try {
    const params = { city, relevant, page, size };
    const response = await api.get<PaginatedResponse<Local>>('/public/locals', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching locals:', error);
    throw error;
  }
};

export const getLocalById = async (localId: string): Promise<Local> => {
  try {
    const response = await api.get<Local>(`/public/locals/${localId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching local ${localId}:`, error);
    throw error;
  }
};

export const getEvents = async (
  city?: string,
  localId?: string,
  relevant?: boolean,
  startDate?: string,
  endDate?: string,
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse<Event>> => {
  try {
    const params = { city, localId, relevant, startDate, endDate, page, size };
    const response = await api.get<PaginatedResponse<Event>>('/public/events', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventById = async (eventId: string): Promise<Event> => {
  try {
    const response = await api.get<Event>(`/public/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error);
    throw error;
  }
};

export const getDrinksByLocalId = async (localId: string): Promise<Drink[]> => {
  try {
    const response = await api.get<Drink[]>(`/public/drinks/local/${localId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching drinks for local ${localId}:`, error);
    throw error;
  }
};

// Auth functions
export const login = async (email: string, password: string): Promise<{ token: string }> => {
  try {
    const response = await api.post('/oauth/token', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<{ success: boolean }> => {
  try {
    const response = await api.post('/public/new_user', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/api/users/self');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Favorites
export const addFavoriteLocal = async (localId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.post('/api/users/favorites/locals', { localId });
    return response.data;
  } catch (error) {
    console.error(`Error adding local ${localId} to favorites:`, error);
    throw error;
  }
};

export const addFavoriteEvent = async (eventId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.post('/api/users/favorites/events', { eventId });
    return response.data;
  } catch (error) {
    console.error(`Error adding event ${eventId} to favorites:`, error);
    throw error;
  }
};

export const removeFavoriteLocal = async (localId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete(`/api/users/favorites/locals/${localId}`);
    return response.data;
  } catch (error) {
    console.error(`Error removing local ${localId} from favorites:`, error);
    throw error;
  }
};

export const removeFavoriteEvent = async (eventId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete(`/api/users/favorites/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error removing event ${eventId} from favorites:`, error);
    throw error;
  }
};

// Checkout
export const purchaseTicket = async (
  eventId: string,
  quantity: number,
  userData?: CheckoutFormData
): Promise<{ success: boolean; ticketId: string }> => {
  try {
    const response = await api.post('/public/purchase', { eventId, quantity, ...userData });
    return response.data;
  } catch (error) {
    console.error('Error purchasing ticket:', error);
    throw error;
  }
};

export default api;
