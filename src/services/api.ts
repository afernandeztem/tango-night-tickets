import axios from 'axios';
import { City, Event, Local, Drink, User, PaginatedResponse, Ticket } from '../types';

// Base URL for API
const API_BASE_URL = 'https://api.tangoapp.example'; // Replace with actual API URL

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
    // For development/testing purposes, we'll return mock data
    // In production, this would call actual API: const response = await api.get('/public/cities');
    return [
      { id: '1', name: 'Madrid', active: true, country: 'Spain', image: 'https://source.unsplash.com/random/800x600/?madrid' },
      { id: '2', name: 'Barcelona', active: true, country: 'Spain', image: 'https://source.unsplash.com/random/800x600/?barcelona' },
      { id: '3', name: 'Valencia', active: true, country: 'Spain', image: 'https://source.unsplash.com/random/800x600/?valencia' },
      { id: '4', name: 'Seville', active: true, country: 'Spain', image: 'https://source.unsplash.com/random/800x600/?seville' },
      { id: '5', name: 'Malaga', active: true, country: 'Spain', image: 'https://source.unsplash.com/random/800x600/?malaga' },
      { id: '6', name: 'Bilbao', active: true, country: 'Spain', image: 'https://source.unsplash.com/random/800x600/?bilbao' },
    ];
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

export const getLocals = async (
  params: { city?: string; page?: number; size?: number; relevant?: boolean } = {}
): Promise<PaginatedResponse<Local>> => {
  try {
    // For development/testing, return mock data
    // In production: const response = await api.get('/public/locals', { params });
    const mockLocals: Local[] = [
      {
        id: '1',
        name: 'Tango Club Madrid',
        city: 'Madrid',
        address: 'Calle Gran Vía, 43, 28013 Madrid',
        image: 'https://source.unsplash.com/random/800x600/?nightclub',
        tags: ['Nightclub', 'Live Music', 'Cocktails'],
        rating: 4.5,
        capacity: 300,
        description: 'The best nightclub in Madrid with live music and amazing cocktails.',
        schedule: [
          { day: 'Monday', openTime: 'Closed', closeTime: 'Closed' },
          { day: 'Tuesday', openTime: 'Closed', closeTime: 'Closed' },
          { day: 'Wednesday', openTime: '22:00', closeTime: '04:00' },
          { day: 'Thursday', openTime: '22:00', closeTime: '04:00' },
          { day: 'Friday', openTime: '23:00', closeTime: '06:00' },
          { day: 'Saturday', openTime: '23:00', closeTime: '06:00' },
          { day: 'Sunday', openTime: 'Closed', closeTime: 'Closed' },
        ]
      },
      {
        id: '2',
        name: 'Salsa Paradise',
        city: 'Madrid',
        address: 'Calle de Alcalá, 20, 28014 Madrid',
        image: 'https://source.unsplash.com/random/800x600/?salsa',
        tags: ['Dancing', 'Salsa', 'Latin'],
        rating: 4.8,
        capacity: 200,
        description: 'The best salsa club in town with professional dancers and classes.',
        schedule: [
          { day: 'Monday', openTime: 'Closed', closeTime: 'Closed' },
          { day: 'Tuesday', openTime: '20:00', closeTime: '02:00' },
          { day: 'Wednesday', openTime: '20:00', closeTime: '02:00' },
          { day: 'Thursday', openTime: '20:00', closeTime: '03:00' },
          { day: 'Friday', openTime: '21:00', closeTime: '05:00' },
          { day: 'Saturday', openTime: '21:00', closeTime: '05:00' },
          { day: 'Sunday', openTime: '18:00', closeTime: '00:00' },
        ]
      },
      {
        id: '3',
        name: 'Flamenco Passion',
        city: 'Madrid',
        address: 'Calle de la Cruz, 7, 28012 Madrid',
        image: 'https://source.unsplash.com/random/800x600/?flamenco',
        tags: ['Flamenco', 'Live Music', 'Traditional'],
        rating: 4.7,
        capacity: 150,
        description: 'Authentic flamenco shows with the best dancers in Madrid.',
        schedule: [
          { day: 'Monday', openTime: '19:00', closeTime: '00:00' },
          { day: 'Tuesday', openTime: '19:00', closeTime: '00:00' },
          { day: 'Wednesday', openTime: '19:00', closeTime: '00:00' },
          { day: 'Thursday', openTime: '19:00', closeTime: '00:00' },
          { day: 'Friday', openTime: '20:00', closeTime: '02:00' },
          { day: 'Saturday', openTime: '20:00', closeTime: '02:00' },
          { day: 'Sunday', openTime: '18:00', closeTime: '00:00' },
        ]
      },
    ];

    // Filter by city if provided
    let filteredLocals = mockLocals;
    if (params.city) {
      filteredLocals = mockLocals.filter(local => local.city.toLowerCase() === params.city?.toLowerCase());
    }

    return {
      content: filteredLocals,
      pageable: {
        pageNumber: params.page || 0,
        pageSize: params.size || 10,
        totalElements: filteredLocals.length,
        totalPages: Math.ceil(filteredLocals.length / (params.size || 10))
      }
    };
  } catch (error) {
    console.error('Error fetching locals:', error);
    throw error;
  }
};

export const getLocalById = async (localId: string): Promise<Local> => {
  try {
    // In production: const response = await api.get(`/public/locals/${localId}`);
    const locals = await getLocals();
    const local = locals.content.find(l => l.id === localId);
    
    if (!local) {
      throw new Error(`Local with ID ${localId} not found`);
    }
    
    return local;
  } catch (error) {
    console.error(`Error fetching local with ID ${localId}:`, error);
    throw error;
  }
};

export const getEventsByLocalId = async (localId: string): Promise<Event[]> => {
  try {
    // In production: const response = await api.get(`/public/events?localId=${localId}`);
    const events = await getEvents({ localId });
    return events.content;
  } catch (error) {
    console.error(`Error fetching events for local ID ${localId}:`, error);
    throw error;
  }
};

export const getEvents = async (
  params: { city?: string; localId?: string; startDate?: string; endDate?: string; page?: number; size?: number; relevant?: boolean } = {}
): Promise<PaginatedResponse<Event>> => {
  try {
    // For development/testing, return mock data
    // In production: const response = await api.get('/public/events', { params });
    
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Salsa Night',
        description: 'Join us for an amazing night of salsa dancing with live music from the Salsa Kings band.',
        date: '2023-06-15T21:00:00',
        image: 'https://source.unsplash.com/random/800x600/?salsa',
        localId: '2',
        localName: 'Salsa Paradise',
        city: 'Madrid',
        ageRestriction: '18+',
        capacity: 200,
        price: 25,
        tags: ['Salsa', 'Dancing', 'Live Music']
      },
      {
        id: '2',
        title: 'Flamenco Experience',
        description: 'Experience the passion of flamenco with our award-winning dancers and musicians.',
        date: '2023-06-18T20:00:00',
        image: 'https://source.unsplash.com/random/800x600/?flamenco',
        localId: '3',
        localName: 'Flamenco Passion',
        city: 'Madrid',
        ageRestriction: 'All ages',
        capacity: 150,
        price: 35,
        tags: ['Flamenco', 'Show', 'Traditional']
      },
      {
        id: '3',
        title: 'DJ Night with DJ Moreno',
        description: 'International DJ Moreno brings the best electronic music to our club.',
        date: '2023-06-20T23:00:00',
        image: 'https://source.unsplash.com/random/800x600/?dj',
        localId: '1',
        localName: 'Tango Club Madrid',
        city: 'Madrid',
        ageRestriction: '21+',
        capacity: 300,
        price: 15,
        tags: ['DJ', 'Electronic', 'Party']
      },
      {
        id: '4',
        title: 'Tango Workshop',
        description: 'Learn the basics of tango with professional dancers and enjoy a night of dancing.',
        date: '2023-06-25T19:00:00',
        image: 'https://source.unsplash.com/random/800x600/?tango',
        localId: '2',
        localName: 'Salsa Paradise',
        city: 'Madrid',
        ageRestriction: '18+',
        capacity: 100,
        price: 30,
        tags: ['Tango', 'Workshop', 'Dancing']
      },
    ];

    // Filter by parameters
    let filteredEvents = mockEvents;
    
    if (params.city) {
      filteredEvents = filteredEvents.filter(event => event.city.toLowerCase() === params.city?.toLowerCase());
    }
    
    if (params.localId) {
      filteredEvents = filteredEvents.filter(event => event.localId === params.localId);
    }

    // TODO: Add date filtering logic if needed

    return {
      content: filteredEvents,
      pageable: {
        pageNumber: params.page || 0,
        pageSize: params.size || 10,
        totalElements: filteredEvents.length,
        totalPages: Math.ceil(filteredEvents.length / (params.size || 10))
      }
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventById = async (eventId: string): Promise<Event> => {
  try {
    // In production: const response = await api.get(`/public/events/${eventId}`);
    const events = await getEvents();
    const event = events.content.find(e => e.id === eventId);
    
    if (!event) {
      throw new Error(`Event with ID ${eventId} not found`);
    }
    
    return event;
  } catch (error) {
    console.error(`Error fetching event with ID ${eventId}:`, error);
    throw error;
  }
};

export const getDrinksByLocalId = async (localId: string): Promise<Drink[]> => {
  try {
    // In production: const response = await api.get(`/public/drinks/local/${localId}`);
    
    // Mock data for development
    const mockDrinks: Drink[] = [
      {
        id: '1',
        name: 'Classic Mojito',
        price: 10,
        description: 'Rum, mint, lime, sugar, and soda water.',
        localId: localId
      },
      {
        id: '2',
        name: 'Piña Colada',
        price: 12,
        description: 'Rum, coconut cream, and pineapple juice.',
        localId: localId
      },
      {
        id: '3',
        name: 'Margarita',
        price: 11,
        description: 'Tequila, lime juice, and triple sec.',
        localId: localId
      },
      {
        id: '4',
        name: 'Beer (Draft)',
        price: 6,
        description: 'Local craft beer on tap.',
        localId: localId
      },
      {
        id: '5',
        name: 'Sangria (Glass)',
        price: 8,
        description: 'Red wine with chopped fruit, brandy, and orange juice.',
        localId: localId
      },
    ];
    
    return mockDrinks;
  } catch (error) {
    console.error(`Error fetching drinks for local ID ${localId}:`, error);
    throw error;
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
    // In production: const response = await api.post('/oauth/token', { email, password });
    
    // Mock login for development
    const mockToken = 'mock-auth-token-123456';
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: email,
      phone: '+1234567890',
      favorites: {
        locals: ['1', '3'],
        events: ['2', '4']
      }
    };
    
    // Store token in localStorage
    localStorage.setItem('token', mockToken);
    
    return { token: mockToken, user: mockUser };
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
    // In production: const response = await api.post('/public/new_user', userData);
    
    // Mock registration for development
    const mockUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      favorites: {
        locals: [],
        events: []
      }
    };
    
    return mockUser;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    // In production: const response = await api.get('/api/users/self');
    
    // Mock user data for development
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      favorites: {
        locals: ['1', '3'],
        events: ['2', '4']
      }
    };
    
    return mockUser;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const toggleFavorite = async (type: 'local' | 'event', id: string): Promise<User> => {
  try {
    // In production: const response = await api.post(`/api/users/favorites/${type}/${id}`);
    
    // Mock toggle favorite for development
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
    
    const locals = await getLocals();
    return locals.content.filter(local => favoriteLocalIds.includes(local.id));
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
    
    const events = await getEvents();
    return events.content.filter(event => favoriteEventIds.includes(event.id));
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
    // In production: const response = await api.post('/api/tickets', { eventId, quantity, userData });
    
    // Get event details
    const event = await getEventById(eventId);
    
    // Mock ticket creation for development
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
    // In production: const response = await api.get('/api/users/tickets');
    
    // Mock tickets for development
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
