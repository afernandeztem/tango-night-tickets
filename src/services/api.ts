import axios from 'axios';
import { City, Event, Local, Drink, User, PaginatedResponse, Ticket } from '../types';

// Base URL for API
const API_BASE_URL = 'https://api.grupotangoapp.com';
// Fixed password from environment
const API_PASSWORD = 'DamxxKUqILNgS5zuSBejMt8Kyd4hu6CLmNLWgosotwQdoncOE2';

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
      id: city.name.toLowerCase(), // Using name as ID
      name: city.name,
      active: city.active,
      country: 'Spain', // Default country as it's not in the API response
      image: city.filename || `https://source.unsplash.com/random/800x600/?${city.name}`, // Use the filename from API
      metricsTotalAmount: city.metricsTotalAmount,
      metricsTotalTickets: city.metricsTotalTickets
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

export const getCityById = async (cityId: string): Promise<City> => {
  try {
    const response = await api.get(`/public/city/${cityId}`);
    const city = response.data;
    
    return {
      id: city.cityName.toLowerCase(),
      name: city.cityName,
      active: city.active,
      country: 'Spain',
      image: `https://source.unsplash.com/random/800x600/?${city.cityName}`,
    };
  } catch (error) {
    console.error(`Error fetching city with ID ${cityId}:`, error);
    throw error;
  }
};

export const getLocals = async (
  params: { city?: string; page?: number; size?: number; relevant?: boolean; search?: string; localType?: number } = {}
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
    
    if (params.localType !== undefined) {
      apiParams.localType = params.localType;
    }
    
    const response = await api.get('/public/locals', { params: apiParams });
    
    // Transform API response to match our Local type
    const locals: Local[] = response.data.content.map((local: any) => ({
      id: local.localId.toString(),
      name: local.name,
      city: local.cityName,
      address: local.street || 'Address not available',
      image: local.fileName || `https://source.unsplash.com/random/800x600/?nightclub`, // Fixed: changed filename to fileName
      tags: local.tags || [],
      rating: local.score > 0 ? local.score : 4.5, // Default rating if score is negative
      capacity: local.capacity || 300, // Default as API might not provide this
      description: local.description || '',
      schedule: convertScheduleFormat(local.schedule)
    }));
    
    return {
      content: locals,
      pageable: {
        pageNumber: response.data.pageable.pageNumber,
        pageSize: response.data.pageable.pageSize,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching locals:', error);
    throw error;
  }
};

// Helper function to convert schedule from API format to our app format
const convertScheduleFormat = (schedule: any): { day: string, openTime: string, closeTime: string }[] => {
  if (!schedule) {
    return [
      { day: 'Friday', openTime: '22:00', closeTime: '06:00' },
      { day: 'Saturday', openTime: '22:00', closeTime: '06:00' },
    ];
  }
  
  const result = [];
  const daysMap: {[key: string]: string} = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };
  
  for (const [day, times] of Object.entries(schedule)) {
    if (Array.isArray(times) && times.length >= 2) {
      result.push({
        day: daysMap[day] || day,
        openTime: times[0].slice(0, 5), // "18:00:00" -> "18:00"
        closeTime: times[1].slice(0, 5), // "02:00:00" -> "02:00"
      });
    }
  }
  
  return result;
};

export const getLocalById = async (localId: string): Promise<Local> => {
  try {
    const response = await api.get(`/public/local/${localId}`);
    const local = response.data;
    
    return {
      id: local.localId.toString(),
      name: local.name,
      city: local.cityName,
      address: local.street || 'Address not available',
      image: local.fileName || `https://source.unsplash.com/random/800x600/?nightclub`, // Fixed: changed filename to fileName
      tags: local.tags || [],
      rating: local.score > 0 ? local.score : 4.5, // Default rating if score is negative
      capacity: local.capacity || 300, // Default as API might not provide this
      description: local.description || '',
      schedule: convertScheduleFormat(local.schedule)
    };
  } catch (error) {
    console.error(`Error fetching local with ID ${localId}:`, error);
    throw error;
  }
};

export const getEventsByLocalId = async (localId: string, page = 0, size = 10): Promise<PaginatedResponse<Event>> => {
  try {
    const response = await api.get(`/public/events/local/${localId}`, {
      params: {
        page,
        size
      }
    });
    
    const events = response.data.content.map((event: any) => ({
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
      ...(event.price !== undefined ? { price: event.price } : {})
    }));
    
    return {
      content: events,
      pageable: {
        pageNumber: response.data.pageable.pageNumber,
        pageSize: response.data.pageable.pageSize,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages
      }
    };
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
      localId: event.localId ? event.localId.toString() : '',
      localName: event.localName,
      city: event.localCity || event.city,
      ageRestriction: event.age ? `${event.age}+` : 'All ages',
      capacity: event.capacity || 200,
      ...(event.price !== undefined ? { price: event.price } : {})
    }));
    
    return {
      content: events,
      pageable: {
        pageNumber: response.data.pageable.pageNumber,
        pageSize: response.data.pageable.pageSize,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getCalendarEvents = async (
  params: { city?: string; startDate?: string; endDate?: string; page?: number; size?: number; relevant?: boolean} = {}
): Promise<PaginatedResponse<Event>> => {
  try {
    const apiParams: any = {
      page: params.page || 0,
      size: params.size || 10,
    };
    
    if (params.city) {
      apiParams.city = params.city;
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
    
    const response = await api.get('/public/events/calendar', { params: apiParams });
    
    // Transform API response to match our Event type
    const events: Event[] = response.data.content.map((event: any) => ({
      id: event.eventId.toString(),
      title: event.title,
      description: event.description || '',
      date: event.eventDate + 'T20:00:00', // Adding default time since API only returns date
      image: event.fileName || `https://source.unsplash.com/random/800x600/?event`,
      localId: event.localId ? event.localId.toString() : '',
      localName: event.localName,
      city: event.localCity || event.city,
      ageRestriction: event.age ? `${event.age}+` : 'All ages',
      capacity: event.capacity || 200,
      ...(event.price !== undefined ? { price: event.price } : {})
    }));
    
    return {
      content: events,
      pageable: {
        pageNumber: response.data.pageable.pageNumber,
        pageSize: response.data.pageable.pageSize,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching calendar events:', error);
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
      localId: event.localId ? event.localId.toString() : '',
      localName: event.localName,
      city: event.localCity,
      ageRestriction: event.age ? `${event.age}+` : 'All ages',
      capacity: event.capacity || 200,
      ...(event.price !== undefined ? { price: event.price } : {}),
      tags: event.tagList || []
    };
  } catch (error) {
    console.error(`Error fetching event with ID ${eventId}:`, error);
    throw error;
  }
};

export const getEventTicketOffers = async (eventId: string, rrppId?: string): Promise<any[]> => {
  try {
    const params: any = {};
    if (rrppId) {
      params.rrppId = rrppId;
    }
    
    const response = await api.get(`/public/entries/event/${eventId}`, { params });
    
    // Transform API response to match the format our app expects
    return response.data.map((offer: any) => ({
      id: offer.offerId ? offer.offerId.toString() : "",
      name: offer.title,
      description: offer.description || 'Incluye acceso para 1 persona. Se asegura el acceso en caso de aforo completo. Reservado el derecho de admisión.',
      price: offer.price,
      available: offer.available > 0,
      soldOut: offer.available === 0,
      rrppOffer: offer.rrpp || false,
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
    const response = await api.get(`/public/drinks/local/${localId}`);
    
    return response.data.map((drink: any) => ({
      id: (drink.offerId || drink.productId || Math.random().toString(36).substring(2)).toString(),
      name: drink.title,
      price: drink.price,
      description: drink.description || '',
      localId: localId,
      category: typeof drink.category === 'number' ? 
        (drink.category === 0 ? 'Beer' : 
         drink.category === 1 ? 'Wine' : 
         drink.category === 2 ? 'Cocktails' : 
         drink.category === 3 ? 'Spirits' : 'Other') : 'Other'
    }));
  } catch (error) {
    console.error(`Error fetching drinks for local ID ${localId}:`, error);
    
    // If the API call fails, return empty array to prevent UI breaking
    return [];
  }
};

export const getLocalOffers = async (localId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/public/offers/local/${localId}`);
    
    return response.data.map((offer: any) => ({
      id: (offer.offerId || Math.random().toString(36).substring(2)).toString(),
      name: offer.title,
      price: offer.price,
      description: offer.description || '',
      type: 'offer',
      localId: localId
    }));
  } catch (error) {
    console.error(`Error fetching offers for local ID ${localId}:`, error);
    
    // If the API call fails, return empty array to prevent UI breaking
    return [];
  }
};

export const getLocalReviews = async (localId: string, page = 0, size = 10): Promise<PaginatedResponse<any>> => {
  try {
    const response = await api.get(`/public/review/local/${localId}`, {
      params: { page, size }
    });
    
    const reviews = response.data.content.map((review: any) => ({
      id: review.reviewId ? review.reviewId.toString() : Math.random().toString(36).substring(2),
      userName: review.userName || 'Anonymous',
      score: review.score || 0,
      comment: review.comment || '',
      createdAt: review.createdAt || new Date().toISOString()
    }));
    
    return {
      content: reviews,
      pageable: {
        pageNumber: response.data.pageable?.pageNumber || 0,
        pageSize: response.data.pageable?.pageSize || 10,
        totalElements: response.data.totalElements || reviews.length,
        totalPages: response.data.totalPages || 1
      }
    };
  } catch (error) {
    console.error(`Error fetching reviews for local ID ${localId}:`, error);
    // Return empty response to prevent UI breaking
    return {
      content: [],
      pageable: {
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0
      }
    };
  }
};

export const createReview = async (reviewData: { localId: string, score: number, comment: string }): Promise<any> => {
  try {
    const response = await api.post('/public/review/', {
      ...reviewData,
      userId: localStorage.getItem('userId') || undefined
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
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
    const authService = await import('./AuthService').then(module => module.default);
    const instance = authService.getInstance();
    
    // Use the OAuth endpoint with client credentials
    const clientCredentials = import.meta.env.VITE_CLIENT_CREDENTIALS || 'Y2xpZW50OkRhbXh4S1VxSUxOZ1M1enVTQmVqTXQ4S3lkNGh1NkNMbU5MV2dvc290d1Fkb25jT0Uy';
    
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    formData.append('grant_type', 'password');
    
    console.log('Attempting login with:', email);
    console.log('Using client credentials:', clientCredentials.substring(0, 10) + '...');
    
    const response = await instance.post('/oauth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${clientCredentials}`,
      }
    });
    
    console.log('Token response:', JSON.stringify(response.data, null, 2));
    
    // Extract tokens from response
    const token = response.data.access_token;
    const refreshToken = response.data.refresh_token;
    
    if (!token || !refreshToken) {
      console.error('Invalid token response:', response.data);
      throw new Error('Invalid token response from server');
    }
    
    // Store tokens using TokenManager
    const TokenManager = await import('./TokenManager').then(module => module.default);
    TokenManager.setTokens(token, refreshToken);
    
    // Set the token for future API calls
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
    
    try {
      // Get user info with the token
      const userInfo = await getCurrentUser();
      return { token, user: userInfo };
    } catch (userError) {
      console.error('Error fetching user info after login:', userError);
      
      // Create a minimal user object to prevent login failure
      // Frontend can refresh user data later
      const minimalUser: User = {
        id: email, // Use email as temporary ID
        name: email.split('@')[0], // Use part before @ as name
        email: email,
        favorites: {
          locals: [],
          events: []
        }
      };
      
      return { token, user: minimalUser };
    }
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
    // Format the data according to API documentation
    const apiData = {
      name: userData.name,
      surnames: "", // Default empty surname
      email: userData.email,
      gender: "O", // Default 'Other' gender
      birthdate: "2000-01-01", // Default birthdate
      notifications: true,
      newsletter: false,
      password: userData.password,
      phone: userData.phone || ""
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
    console.log('Fetching current user with token:', localStorage.getItem('token')?.substring(0, 10) + '...');
    
    const response = await api.get('/api/users/self');
    console.log('User response data:', JSON.stringify(response.data, null, 2));
    
    // Transform API response to match our User type
    const user: User = {
      id: response.data.userTango?.userId?.toString() || 'temp-id',
      name: response.data.userTango?.name || 'User',
      email: response.data.userTango?.email || '',
      phone: response.data.userTango?.phone || '',
      favorites: {
        locals: response.data.favoriteList?.filter((item: any) => item.favoriteType === 'LOCAL').map((item: any) => item.entityId.toString()) || [],
        events: response.data.favoriteList?.filter((item: any) => item.favoriteType === 'EVENT').map((item: any) => item.entityId.toString()) || []
      }
    };
    
    localStorage.setItem('userId', user.id);
    
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

export const recoverPassword = async (email: string): Promise<void> => {
  try {
    await api.post('/public/recover', { email });
  } catch (error) {
    console.error('Error requesting password recovery:', error);
    throw error;
  }
};

export const setPassword = async (password: string, token: string): Promise<void> => {
  try {
    await api.post('/public/set-password', { password, token });
  } catch (error) {
    console.error('Error setting password:', error);
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

export const getTags = async (search?: string): Promise<any[]> => {
  try {
    const params: any = {};
    if (search) {
      params.search = search;
    }
    
    const response = await api.get('/public/tags', { params });
    
    return response.data.map((tag: any) => ({
      id: tag.tagId.toString(),
      name: tag.name,
      active: tag.active
    }));
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};

export const getLocalTypes = async (): Promise<string[]> => {
  try {
    const response = await api.get('/public/types');
    return response.data;
  } catch (error) {
    console.error('Error fetching local types:', error);
    return [];
  }
};

export default api;
