
import axios from 'axios';
import { City, Event, Local, Drink, User, PaginatedResponse, Ticket } from '../types';

// Base URL for API
const API_BASE_URL = 'https://api.grupotangoapp.com';

// Create axios instance with common config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Public endpoints

export const getCities = async (): Promise<City[]> => {
  try {
    const response = await api.get('/public/cities');
    return response.data.map((city: any) => ({
      id: city.name.toLowerCase(), // Using name as ID since the API doesn't return IDs
      name: city.name,
      active: city.active,
      country: 'Spain', // Default country as it's not in the API response
      image: `https://source.unsplash.com/random/800x600/?${city.name}` // Using placeholder images
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

export const getLocals = async (
  params: { city?: string; page?: number; size?: number; relevant?: boolean; search?: string } = {}
): Promise<PaginatedResponse<Local>> => {
  try {
    const apiParams: any = {
      page: params.page || 0,
      size: params.size || 10,
    };
    
    if (params.city) {
      apiParams.city = params.city;
    }
    
    if (params.search) {
      apiParams.search = params.search;
    }
    
    if (params.relevant !== undefined) {
      apiParams.relevant = params.relevant;
    }
    
    const response = await api.get('/public/locals', { params: apiParams });
    
    // Transform API response to match our Local type
    const locals: Local[] = response.data.content.map((local: any) => ({
      id: local.localId.toString(),
      name: local.name,
      city: local.city,
      address: `${local.street}, ${local.zipCode} ${local.city}`,
      image: local.fileName || `https://source.unsplash.com/random/800x600/?nightclub`,
      tags: local.tagList || [],
      rating: local.score > 0 ? local.score : 4.5, // Default rating if score is negative
      capacity: 300, // Default as API doesn't provide this
      description: local.description || '',
      schedule: local.schedule || [
        { day: 'Friday', openTime: '22:00', closeTime: '06:00' },
        { day: 'Saturday', openTime: '22:00', closeTime: '06:00' },
      ]
    }));
    
    return {
      content: locals,
      pageable: {
        pageNumber: response.data.number,
        pageSize: response.data.size,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching locals:', error);
    throw error;
  }
};

export const getLocalById = async (localId: string): Promise<Local> => {
  try {
    const response = await api.get(`/public/local/${localId}`);
    const local = response.data;
    
    return {
      id: local.localId.toString(),
      name: local.name,
      city: local.city,
      address: `${local.street}, ${local.zipCode} ${local.city}`,
      image: local.fileName || `https://source.unsplash.com/random/800x600/?nightclub`,
      tags: local.tagList || [],
      rating: local.score > 0 ? local.score : 4.5, // Default rating if score is negative
      capacity: 300, // Default as API doesn't provide this
      description: local.description || '',
      schedule: local.schedule || [
        { day: 'Friday', openTime: '22:00', closeTime: '06:00' },
        { day: 'Saturday', openTime: '22:00', closeTime: '06:00' },
      ]
    };
  } catch (error) {
    console.error(`Error fetching local with ID ${localId}:`, error);
    throw error;
  }
};

export const getEventsByLocalId = async (localId: string): Promise<Event[]> => {
  try {
    const response = await api.get(`/public/events/local/${localId}`, {
      params: {
        size: 100 // Get a larger number to ensure we get all events
      }
    });
    
    return response.data.content.map((event: any) => ({
      id: event.eventId.toString(),
      title: event.title,
      description: event.description || '',
      date: event.eventDate + 'T20:00:00', // Adding default time since API only returns date
      image: event.fileName || `https://source.unsplash.com/random/800x600/?event`,
      localId: event.localId.toString(),
      localName: event.localName,
      city: event.localCity,
      ageRestriction: event.age ? `${event.age}+` : 'All ages',
      capacity: event.capacity || 200,
      price: 15, // Default price as API doesn't provide this
      tags: event.tagList || []
    }));
  } catch (error) {
    console.error(`Error fetching events for local ID ${localId}:`, error);
    throw error;
  }
};

export const getEvents = async (
  params: { city?: string; localId?: string; startDate?: string; endDate?: string; page?: number; size?: number; relevant?: boolean; search?: string } = {}
): Promise<PaginatedResponse<Event>> => {
  try {
    const apiParams: any = {
      page: params.page || 0,
      size: params.size || 10,
    };
    
    if (params.city) {
      apiParams.city = params.city;
    }
    
    if (params.search) {
      apiParams.search = params.search;
    }
    
    if (params.startDate) {
      apiParams.startDate = params.startDate;
    }
    
    if (params.endDate) {
      apiParams.endDate = params.endDate;
    }
    
    if (params.relevant !== undefined) {
      apiParams.relevant = params.relevant;
    }
    
    const response = await api.get('/public/events', { params: apiParams });
    
    // Transform API response to match our Event type
    const events: Event[] = response.data.content.map((event: any) => ({
      id: event.eventId.toString(),
      title: event.title,
      description: event.description || '',
      date: event.eventDate + 'T20:00:00', // Adding default time since API only returns date
      image: event.fileName || `https://source.unsplash.com/random/800x600/?event`,
      localId: event.localId.toString(),
      localName: event.localName,
      city: event.localCity,
      ageRestriction: event.age ? `${event.age}+` : 'All ages',
      capacity: event.capacity || 200,
      price: 15, // Default price as API doesn't provide this
      tags: event.tagList || []
    }));
    
    return {
      content: events,
      pageable: {
        pageNumber: response.data.number,
        pageSize: response.data.size,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventById = async (eventId: string): Promise<Event> => {
  try {
    const response = await api.get(`/public/event/${eventId}`);
    const event = response.data;
    
    return {
      id: event.eventId.toString(),
      title: event.title,
      description: event.description || '',
      date: event.eventDate + 'T20:00:00', // Adding default time since API only returns date
      image: event.fileName || `https://source.unsplash.com/random/800x600/?event`,
      localId: event.localId.toString(),
      localName: event.localName,
      city: event.localCity,
      ageRestriction: event.age ? `${event.age}+` : 'All ages',
      capacity: event.capacity || 200,
      price: 15, // Default price as API doesn't provide this
      tags: event.tagList || []
    };
  } catch (error) {
    console.error(`Error fetching event with ID ${eventId}:`, error);
    throw error;
  }
};

export const getEventTicketOffers = async (eventId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/public/offers/event/${eventId}`);
    
    // Transform API response to match the format our app expects
    return response.data.content.map((offer: any) => ({
      id: offer.offerId.toString(),
      name: offer.title,
      description: offer.description || 'Incluye acceso para 1 persona. Se asegura el acceso en caso de aforo completo. Reservado el derecho de admisión.',
      price: offer.price,
      available: !offer.isSoldOut,
      soldOut: offer.isSoldOut,
      timeLeft: offer.remainingTime || undefined
    }));
  } catch (error) {
    console.error(`Error fetching ticket offers for event ID ${eventId}:`, error);
    // Return empty array to prevent UI breaking
    return [];
  }
};

export const getDrinksByLocalId = async (localId: string): Promise<Drink[]> => {
  try {
    const response = await api.get(`/public/local/${localId}`);
    const local = response.data;
    const drinks = local.drinkList || [];
    
    return drinks.map((drink: any) => ({
      id: drink.offerId.toString(),
      name: drink.title,
      price: drink.price,
      description: drink.description || '',
      localId: localId
    }));
  } catch (error) {
    console.error(`Error fetching drinks for local ID ${localId}:`, error);
    
    // If the API call fails, return empty array to prevent UI breaking
    return [];
  }
};

// Authentication & User endpoints

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  gender?: string;
}

export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  try {
    // OAuth2 login
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    formData.append('grant_type', 'password');
    
    const response = await axios.post(`${API_BASE_URL}/oauth/token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const token = response.data.access_token;
    
    // Store token in localStorage
    localStorage.setItem('token', token);
    
    // Get user info with the token
    const userInfo = await getCurrentUser();
    
    return { token, user: userInfo };
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
}): Promise<User> => {
  try {
    // Format the data according to API requirements
    const apiData = {
      name: userData.name,
      surname: "", // Default empty surname
      email: userData.email,
      gender: "O", // Default 'Other' gender
      birthdate: "2000-01-01", // Default birthdate
      notifications: true,
      newsletter: false,
      password: userData.password
    };
    
    const response = await api.post('/public/new_user', apiData);
    
    // Transform API response to match our User type
    const user: User = {
      id: response.data.userId.toString(),
      name: response.data.name,
      email: response.data.email,
      phone: userData.phone,
      favorites: {
        locals: [],
        events: []
      }
    };
    
    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get('/api/users/self');
    
    // Transform API response to match our User type
    const user: User = {
      id: response.data.userTango.userId.toString(),
      name: response.data.userTango.name,
      email: response.data.userTango.email,
      phone: response.data.userTango.phone,
      favorites: {
        locals: response.data.favoriteList.filter((item: any) => item.favoriteType === 'LOCAL').map((item: any) => item.entityId.toString()),
        events: response.data.favoriteList.filter((item: any) => item.favoriteType === 'EVENT').map((item: any) => item.entityId.toString())
      }
    };
    
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const toggleFavorite = async (type: 'local' | 'event', id: string): Promise<User> => {
  try {
    // The API doesn't have a documented endpoint for toggling favorites
    // For now, we'll simulate it locally
    const user = await getCurrentUser();
    const favorites = user.favorites || { locals: [], events: [] };
    
    if (type === 'local') {
      if (favorites.locals.includes(id)) {
        favorites.locals = favorites.locals.filter(localId => localId !== id);
      } else {
        favorites.locals.push(id);
      }
    } else {
      if (favorites.events.includes(id)) {
        favorites.events = favorites.events.filter(eventId => eventId !== id);
      } else {
        favorites.events.push(id);
      }
    }
    
    user.favorites = favorites;
    return user;
  } catch (error) {
    console.error(`Error toggling favorite ${type} with ID ${id}:`, error);
    throw error;
  }
};

export const getFavoriteLocals = async (): Promise<Local[]> => {
  try {
    const user = await getCurrentUser();
    const favoriteLocalIds = user.favorites?.locals || [];
    
    if (favoriteLocalIds.length === 0) {
      return [];
    }
    
    // Fetch each local individually
    const promises = favoriteLocalIds.map(id => getLocalById(id));
    return Promise.all(promises);
  } catch (error) {
    console.error('Error fetching favorite locals:', error);
    throw error;
  }
};

export const getFavoriteEvents = async (): Promise<Event[]> => {
  try {
    const user = await getCurrentUser();
    const favoriteEventIds = user.favorites?.events || [];
    
    if (favoriteEventIds.length === 0) {
      return [];
    }
    
    // Fetch each event individually
    const promises = favoriteEventIds.map(id => getEventById(id));
    return Promise.all(promises);
  } catch (error) {
    console.error('Error fetching favorite events:', error);
    throw error;
  }
};

// Checkout and tickets

export const createTicket = async (
  eventId: string,
  quantity: number,
  userData?: CheckoutFormData
): Promise<Ticket> => {
  try {
    // The API doesn't have a documented endpoint for creating tickets
    // For now, we'll simulate it locally
    
    // Get event details
    const event = await getEventById(eventId);
    
    // Mock ticket creation
    const mockTicket: Ticket = {
      id: Math.random().toString(36).substring(2, 9),
      eventId: event.id,
      eventTitle: event.title,
      date: event.date,
      localName: event.localName || '',
      price: event.price,
      quantity: quantity
    };
    
    return mockTicket;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

export const getUserTickets = async (): Promise<Ticket[]> => {
  try {
    // The API doesn't have a documented endpoint for getting user tickets
    // For now, we'll return mock data
    
    const mockTickets: Ticket[] = [
      {
        id: '1',
        eventId: '2',
        eventTitle: 'Flamenco Experience',
        date: '2023-06-18T20:00:00',
        localName: 'Flamenco Passion',
        price: 35,
        quantity: 2
      },
      {
        id: '2',
        eventId: '3',
        eventTitle: 'DJ Night with DJ Moreno',
        date: '2023-06-20T23:00:00',
        localName: 'Tango Club Madrid',
        price: 15,
        quantity: 1
      }
    ];
    
    return mockTickets;
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    throw error;
  }
};

export default api;
