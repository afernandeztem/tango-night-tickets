import { City, Event, Local, User, Drink, AuthResponse, FavoritesResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001'; // Replace with your actual API base URL

// Authentication functions
export const registerUser = async (userData: Omit<User, 'id' | 'favorites'>): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return await response.json();
};

export const loginUser = async (credentials: Pick<User, 'email' | 'password'>): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return await response.json();
};

export const getProfile = async (token: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return await response.json();
};

export const updateProfile = async (token: string, userData: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('Failed to update profile');
    }

    return await response.json();
};

// Favorites functions
export const getFavoriteEvents = async (token?: string): Promise<Event[]> => {
  const response = await fetch(`${API_BASE_URL}/favorites/events`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch favorite events');
  }

  return await response.json();
};

export const getFavoriteLocals = async (token?: string): Promise<Local[]> => {
  const response = await fetch(`${API_BASE_URL}/favorites/locals`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch favorite locals');
  }

  return await response.json();
};

export const toggleFavorite = async (type: 'event' | 'local', id: string, token: string): Promise<FavoritesResponse> => {
  const response = await fetch(`${API_BASE_URL}/favorites/toggle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ type, id }),
  });

  if (!response.ok) {
    throw new Error('Failed to toggle favorite');
  }

  return await response.json();
};

// City functions
export const getCities = async (): Promise<City[]> => {
  const response = await fetch(`${API_BASE_URL}/cities`);

  if (!response.ok) {
    throw new Error('Failed to fetch cities');
  }

  return await response.json();
};

// Local functions
interface GetLocalsParams {
  city?: string;
  search?: string;
  relevant?: boolean;
  page?: number;
  size?: number;
}

interface LocalsResponse {
  content: Local[];
  totalPages: number;
  totalElements: number;
}

export const getLocals = async (params: GetLocalsParams): Promise<LocalsResponse> => {
  const url = new URL(`${API_BASE_URL}/locals`);
  if (params.city) url.searchParams.append('city', params.city);
  if (params.search) url.searchParams.append('search', params.search);
  if (params.relevant) url.searchParams.append('relevant', 'true');
  if (params.page) url.searchParams.append('page', params.page.toString());
  if (params.size) url.searchParams.append('size', params.size.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to fetch locals');
  }

  return await response.json();
};

export const getLocalById = async (id: string): Promise<Local> => {
  const response = await fetch(`${API_BASE_URL}/locals/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch local');
  }

  return await response.json();
};

export const getLocalsByCity = async (city: string): Promise<Local[]> => {
  const response = await fetch(`${API_BASE_URL}/locals?city=${city}`);

  if (!response.ok) {
    throw new Error('Failed to fetch locals by city');
  }

  return await response.json();
};

// Event functions
interface GetEventsParams {
  city?: string;
  startDate?: string;
  search?: string;
  relevant?: boolean;
  page?: number;
  size?: number;
}

interface EventsResponse {
  content: Event[];
  totalPages: number;
  totalElements: number;
}

export const getEvents = async (params: GetEventsParams): Promise<EventsResponse> => {
  const url = new URL(`${API_BASE_URL}/events`);
  if (params.city) url.searchParams.append('city', params.city);
  if (params.startDate) url.searchParams.append('startDate', params.startDate);
  if (params.search) url.searchParams.append('search', params.search);
  if (params.relevant) url.searchParams.append('relevant', 'true');
  if (params.page) url.searchParams.append('page', params.page.toString());
  if (params.size) url.searchParams.append('size', params.size.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  return await response.json();
};

export const getEventById = async (id: string): Promise<Event> => {
  const response = await fetch(`${API_BASE_URL}/events/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch event');
  }

  return await response.json();
};

export const getEventsByLocalId = async (localId: string): Promise<Event[]> => {
  const response = await fetch(`${API_BASE_URL}/events?localId=${localId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch events by localId');
  }

  return await response.json();
};

// Drink functions
export const getDrinksByLocalId = async (localId: string): Promise<Drink[]> => {
  const response = await fetch(`${API_BASE_URL}/drinks?localId=${localId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch drinks by localId');
  }

  return await response.json();
};

// Generate more realistic images for cities
const cityImages = {
  'Madrid': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  'Valencia': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  'Sevilla': 'https://images.unsplash.com/photo-1551634979-2b11f8c218a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  'Bilbao': 'https://images.unsplash.com/photo-1570540315489-c00e09427d2b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  'Málaga': 'https://images.unsplash.com/photo-1591704066868-eb6f858db842?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
};

// Nightclub images
const clubImages = [
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1973&q=80',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1438557068880-c5f474830377?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1967&q=80',
];

// Event images
const eventImages = [
  'https://images.unsplash.com/photo-1574824357984-86ac3930bdcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
];

// Mock data for cities
const mockCities: City[] = [
  {
    id: '1',
    name: 'Madrid',
    country: 'Spain',
    description: 'Capital city of Spain with vibrant nightlife',
    image: cityImages['Madrid'],
    active: true
  },
  {
    id: '2',
    name: 'Barcelona',
    country: 'Spain',
    description: 'Coastal city known for its art and architecture',
    image: cityImages['Barcelona'],
    active: true
  },
  {
    id: '3',
    name: 'Valencia',
    country: 'Spain',
    description: 'City of arts and sciences with great beaches',
    image: cityImages['Valencia'],
    active: true
  },
  {
    id: '4',
    name: 'Sevilla',
    country: 'Spain',
    description: 'Famous for flamenco dancing and Gothic architecture',
    image: cityImages['Sevilla'],
    active: true
  },
  {
    id: '5',
    name: 'Bilbao',
    country: 'Spain',
    description: 'Known for the Guggenheim Museum and cuisine',
    image: cityImages['Bilbao'],
    active: true
  },
  {
    id: '6',
    name: 'Málaga',
    country: 'Spain',
    description: 'Sunny coastal city with beautiful beaches',
    image: cityImages['Málaga'],
    active: true
  }
];

// Mock data for locals (venues)
const mockLocals: Local[] = [
  {
    id: '1',
    name: 'Fabrik Madrid',
    city: 'Madrid',
    address: 'Avenida de la Industria 82, 28970 Humanes de Madrid',
    description: 'One of the largest and most popular nightclubs in Madrid, featuring multiple rooms with different music styles.',
    image: clubImages[0],
    capacity: 4000,
    rating: 4.5,
    tags: ['Techno', 'House', 'Electronic'],
    schedule: [
      { day: 'Friday', openTime: '23:30', closeTime: '06:00' },
      { day: 'Saturday', openTime: '23:30', closeTime: '06:00' }
    ]
  },
  {
    id: '2',
    name: 'Opium Barcelona',
    city: 'Barcelona',
    address: 'Passeig Marítim de la Barceloneta 34, 08003 Barcelona',
    description: 'Beachfront club with terrace, offering great views of the Mediterranean and top-notch DJs.',
    image: clubImages[1],
    capacity: 2500,
    rating: 4.3,
    tags: ['House', 'EDM', 'Beach Club'],
    schedule: [
      { day: 'Monday', openTime: '23:59', closeTime: '06:00' },
      { day: 'Tuesday', openTime: '23:59', closeTime: '06:00' },
      { day: 'Wednesday', openTime: '23:59', closeTime: '06:00' },
      { day: 'Thursday', openTime: '23:59', closeTime: '06:00' },
      { day: 'Friday', openTime: '23:59', closeTime: '06:00' },
      { day: 'Saturday', openTime: '23:59', closeTime: '06:00' },
      { day: 'Sunday', openTime: '23:59', closeTime: '06:00' }
    ]
  },
  {
    id: '3',
    name: 'Pacha Valencia',
    city: 'Valencia',
    address: 'Avenida de Francia s/n, 46023 Valencia',
    description: 'Iconic branch of the world-famous Pacha nightclub. Expect glamour, EDM, and great production.',
    image: clubImages[2],
    capacity: 1800,
    rating: 4.2,
    tags: ['House', 'EDM', 'VIP'],
    schedule: [
      { day: 'Friday', openTime: '23:45', closeTime: '06:30' },
      { day: 'Saturday', openTime: '23:45', closeTime: '06:30' }
    ]
  },
  {
    id: '4',
    name: 'Antique Theatro',
    city: 'Sevilla',
    address: 'Calle Matemáticos Rey Pastor y Castro, 41092 Sevilla',
    description: 'Massive club with multiple environments, cutting-edge sound and light systems.',
    image: clubImages[3],
    capacity: 3500,
    rating: 4.4,
    tags: ['Reggaeton', 'Latin', 'Commercial'],
    schedule: 'Open Friday and Saturday from 00:00 to 06:30'
  },
  {
    id: '5',
    name: 'Sonora Bilbao',
    city: 'Bilbao',
    address: 'Calle Particular de Estraunza 3, 48011 Bilbao',
    description: 'Alternative music venue focused on live performances and electronic music.',
    image: clubImages[4],
    capacity: 1200,
    rating: 4.1,
    tags: ['Live Music', 'Underground', 'Alternative'],
    schedule: [
      { day: 'Thursday', openTime: '22:00', closeTime: '04:00' },
      { day: 'Friday', openTime: '23:00', closeTime: '05:30' },
      { day: 'Saturday', openTime: '23:00', closeTime: '05:30' }
    ]
  },
  {
    id: '6',
    name: 'Sala Gold Málaga',
    city: 'Málaga',
    address: 'Calle Comedias 7, 29012 Málaga',
    description: 'Popular club in the heart of Málaga with a mix of commercial and EDM music.',
    image: clubImages[5],
    capacity: 900,
    rating: 3.9,
    tags: ['Commercial', 'EDM', 'Mainstream'],
    schedule: 'Open Thursday to Saturday from 00:00 to 06:00'
  },
  {
    id: '7',
    name: 'Teatro Kapital',
    city: 'Madrid',
    address: 'Calle de Atocha 125, 28012 Madrid',
    description: 'Seven-floor megaclub with different music on each level, including a rooftop terrace.',
    image: clubImages[6],
    capacity: 2500,
    rating: 4.0,
    tags: ['Multi-level', 'Mixed Music', 'VIP'],
    schedule: [
      { day: 'Thursday', openTime: '23:30', closeTime: '05:30' },
      { day: 'Friday', openTime: '23:30', closeTime: '05:30' },
      { day: 'Saturday', openTime: '23:30', closeTime: '05:30' }
    ]
  },
  {
    id: '8',
    name: 'Razzmatazz',
    city: 'Barcelona',
    address: 'Calle dels Almogàvers 122, 08018 Barcelona',
    description: 'Industrial complex turned into a multi-room venue hosting live music and club nights.',
    image: clubImages[0],
    capacity: 3000,
    rating: 4.6,
    tags: ['Indie', 'Electronic', 'Live Music'],
    schedule: [
      { day: 'Thursday', openTime: '00:00', closeTime: '05:00' },
      { day: 'Friday', openTime: '00:00', closeTime: '06:00' },
      { day: 'Saturday', openTime: '00:00', closeTime: '06:00' }
    ]
  }
];

// Mock data for events
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Techno Party',
    description: 'A night of cutting-edge techno with international DJs',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // One week from now
    price: 25,
    available: true,
    image: eventImages[0],
    localId: '1',
    location: 'Fabrik Madrid, Madrid',
    tags: ['Techno', 'Electronic', 'DJ Set']
  },
  {
    id: '2',
    title: 'Beachside House Sessions',
    description: 'Enjoy the best house music with views of the Mediterranean',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Two days from now
    price: 30,
    available: true,
    image: eventImages[1],
    localId: '2',
    location: 'Opium Barcelona, Barcelona',
    tags: ['House', 'Beach', 'DJ Set']
  },
  {
    id: '3',
    title: 'Valencia EDM Showcase',
    description: 'The biggest EDM party of the year with spectacular shows',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Two weeks from now
    price: 35,
    available: true,
    image: eventImages[2],
    localId: '3',
    location: 'Pacha Valencia, Valencia',
    tags: ['EDM', 'Party', 'Dance']
  },
  {
    id: '4',
    title: 'Reggaeton Night',
    description: 'The hottest reggaeton beats with special guest artists',
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // Four days from now
    price: 20,
    available: true,
    image: eventImages[3],
    localId: '4',
    location: 'Antique Theatro, Sevilla',
    tags: ['Reggaeton', 'Latin', 'Dance']
  },
  {
    id: '5',
    title: 'Alternative Rock Live',
    description: 'Live performance by top indie and rock bands',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Five days from now
    price: 18,
    available: true,
    image: eventImages[4],
    localId: '5',
    location: 'Sonora Bilbao, Bilbao',
    tags: ['Rock', 'Live Music', 'Indie']
  },
  {
    id: '6',
    title: 'Saturday Night Fever',
    description: 'The ultimate weekend party with the best commercial hits',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Three days from now
    price: 15,
    available: true,
    image: eventImages[5],
    localId: '6',
    location: 'Sala Gold Málaga, Málaga',
    tags: ['Commercial', 'Dance', 'Weekend']
  },
  {
    id: '7',
    title: 'Kapital Rooftop Session',
    description: 'Exclusive party on the rooftop terrace with panoramic views of Madrid',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // Ten days from now
    price: 30,
    available: true,
    image: eventImages[6],
    localId: '7',
    location: 'Teatro Kapital, Madrid',
    tags: ['Rooftop', 'House', 'VIP']
  },
  {
    id: '8',
    title: 'Indie Festival',
    description: 'Multiple indie bands performing live at Barcelona\'s iconic venue',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // Fifteen days from now
    price: 27,
    available: true,
    image: eventImages[0],
    localId: '8',
    location: 'Razzmatazz, Barcelona',
    tags: ['Indie', 'Festival', 'Live Music']
  },
  {
    id: '9',
    title: 'DJ Marathon',
    description: '12-hour set with rotating international DJs',
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // Eight days from now
    price: 40,
    available: true,
    image: eventImages[1],
    localId: '1',
    location: 'Fabrik Madrid, Madrid',
    tags: ['Marathon', 'DJ Set', 'Electronic']
  },
  {
    id: '10',
    title: 'Beach Party Special',
    description: 'Special summer edition beach party with fireworks and shows',
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // Six days from now
    price: 35,
    available: true,
    image: eventImages[3],
    localId: '2',
    location: 'Opium Barcelona, Barcelona',
    tags: ['Beach', 'Party', 'Summer']
  }
];

// Mock data for drinks
const mockDrinks: Drink[] = [
  { id: '1', name: 'Mojito', price: 8.50, description: 'Classic Cuban cocktail with rum, mint, lime, and soda' },
  { id: '2', name: 'Margarita', price: 9.00, description: 'Refreshing tequila-based cocktail with lime and orange liqueur' },
  { id: '3', name: 'Cosmopolitan', price: 9.50, description: 'Sophisticated vodka cocktail with cranberry, lime, and Cointreau' },
  { id: '4', name: 'Old Fashioned', price: 10.00, description: 'Timeless whiskey cocktail with sugar, bitters, and orange peel' },
  { id: '5', name: 'Negroni', price: 10.50, description: 'Italian aperitivo with gin, Campari, and sweet vermouth' },
  { id: '6', name: 'Espresso Martini', price: 11.00, description: 'Stimulating coffee cocktail with vodka, espresso, and coffee liqueur' },
  { id: '7', name: 'Pina Colada', price: 8.00, description: 'Tropical delight with rum, coconut cream, and pineapple juice' },
  { id: '8', name: 'Daiquiri', price: 8.50, description: 'Simple yet satisfying rum cocktail with lime and sugar' },
  { id: '9', name: 'Whiskey Sour', price: 9.00, description: 'Balanced whiskey cocktail with lemon, sugar, and egg white' },
  { id: '10', name: 'Manhattan', price: 11.50, description: 'Elegant whiskey cocktail with sweet vermouth and bitters' }
];

// Mock API calls (replace with actual API calls)
export const useMockApi = () => {
  return {
    registerUser: (userData: Omit<User, 'id' | 'favorites'>) =>
      new Promise<AuthResponse>((resolve) => {
        setTimeout(() => {
          // Mock successful registration
          resolve({
            token: 'mocked_user_token',
            user: {
              id: 'mocked_user_id',
              name: userData.name,
              email: userData.email,
              password: userData.password,
              favorites: { events: [], locals: [] },
            },
          });
        }, 500); // Simulate network delay
      }),
    loginUser: (credentials: Pick<User, 'email' | 'password'>) =>
      new Promise<AuthResponse>((resolve, reject) => {
        setTimeout(() => {
          // Mock successful login
          if (credentials.email === 'test@example.com' && credentials.password === 'password') {
            resolve({
              token: 'mocked_user_token',
              user: {
                id: 'mocked_user_id',
                name: 'Test User',
                email: credentials.email,
                password: credentials.password,
                favorites: { events: [], locals: [] },
              },
            });
          } else {
            reject({ message: 'Invalid credentials' });
          }
        }, 500); // Simulate network delay
      }),
    getProfile: (token: string) =>
      new Promise<User>((resolve, reject) => {
        setTimeout(() => {
          if (token === 'mocked_user_token') {
            resolve({
              id: 'mocked_user_id',
              name: 'Test User',
              email: 'test@example.com',
              password: 'password',
              favorites: { events: [], locals: [] },
            });
          } else {
            reject({ message: 'Unauthorized' });
          }
        }, 300);
      }),
    updateProfile: (token: string, userData: Partial<User>) =>
      new Promise<User>((resolve, reject) => {
        setTimeout(() => {
          if (token === 'mocked_user_token') {
            // Simulate updating the user profile
            const updatedUser: User = {
              id: 'mocked_user_id',
              name: userData.name || 'Test User',
              email: userData.email || 'test@example.com',
              password: 'password', // In real app, never send password back
              favorites: { events: [], locals: [] },
            };
            resolve(updatedUser);
          } else {
            reject({ message: 'Unauthorized' });
          }
        }, 300);
      }),
    getCities: () =>
      new Promise<City[]>((resolve) => {
        setTimeout(() => {
          resolve(mockCities);
        }, 300);
      }),
    getLocals: (params: GetLocalsParams) =>
      new Promise<LocalsResponse>((resolve) => {
        setTimeout(() => {
          let filteredLocals = mockLocals;
          if (params.city) {
            filteredLocals = filteredLocals.filter((local) => local.city === params.city);
          }
          if (params.search) {
            filteredLocals = filteredLocals.filter((local) =>
              local.name.toLowerCase().includes(params.search!.toLowerCase())
            );
          }
          const page = params.page || 0;
          const size = params.size || 10;
          const start = page * size;
          const end = start + size;
          const content = filteredLocals.slice(start, end);
          const totalPages = Math.ceil(filteredLocals.length / size);
          const totalElements = filteredLocals.length;
          resolve({ content, totalPages, totalElements });
        }, 300);
      }),
    getLocalById: (id: string) =>
      new Promise<Local>((resolve, reject) => {
        setTimeout(() => {
          const local = mockLocals.find(l => l.id === id);
          if (local) {
            resolve(local);
          } else {
            reject({ message: 'Local not found' });
          }
        }, 300);
      }),
    getLocalsByCity: (city: string) =>
      new Promise<Local[]>((resolve) => {
        setTimeout(() => {
          const locals = mockLocals.filter(l => l.city === city);
          resolve(locals);
        }, 300);
      }),
    getEvents: (params: GetEventsParams) =>
      new Promise<EventsResponse>((resolve) => {
        setTimeout(() => {
          let filteredEvents = mockEvents;
          if (params.city) {
            filteredEvents = filteredEvents.filter((event) => 
              event.location.includes(params.city!)
            );
          }
          if (params.startDate) {
            filteredEvents = filteredEvents.filter((event) => 
              new Date(event.date) >= new Date(params.startDate!)
            );
          }
          if (params.search) {
            filteredEvents = filteredEvents.filter((event) =>
              event.title.toLowerCase().includes(params.search!.toLowerCase()) ||
              event.description.toLowerCase().includes(params.search!.toLowerCase())
            );
          }
          const page = params.page || 0;
          const size = params.size || 10;
          const start = page * size;
          const end = start + size;
          const content = filteredEvents.slice(start, end);
          const totalPages = Math.ceil(filteredEvents.length / size);
          const totalElements = filteredEvents.length;
          resolve({ content, totalPages, totalElements });
        }, 300);
      }),
    getEventById: (id: string) =>
      new Promise<Event>((resolve, reject) => {
        setTimeout(() => {
          const event = mockEvents.find(e => e.id === id);
          if (event) {
            resolve(event);
          } else {
            reject({ message: 'Event not found' });
          }
        }, 300);
      }),
    getEventsByLocalId: (localId: string) =>
      new Promise<Event[]>((resolve) => {
        setTimeout(() => {
          const events = mockEvents.filter(e => e.localId === localId);
          resolve(events);
        }, 300);
      }),
    getDrinksByLocalId: (localId: string) =>
      new Promise<Drink[]>((resolve) => {
        setTimeout(() => {
          // This is just mock data so we're returning all drinks
          // In a real app, this would filter by localId
          resolve(mockDrinks);
        }, 300);
      }),
    toggleFavorite: (type: 'event' | 'local', id: string, token: string) =>
      new Promise<FavoritesResponse>((resolve) => {
        setTimeout(() => {
          // Just mock the response
          resolve({
            success: true,
            message: `${type} with id ${id} toggled successfully`,
            favorites: {
              events: type === 'event' ? [id] : [],
              locals: type === 'local' ? [id] : []
            }
          });
        }, 300);
      })
  };
};
