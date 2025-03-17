export interface City {
  id: string;
  name: string;
  active: boolean;
  country?: string;
  image?: string;
  metricsTotalAmount?: number;
  metricsTotalTickets?: number;
  displayName?: string;  // Normalized name without accents
  originalName?: string; // Original name with accents preserved
}

export interface Local {
  id: string;
  name: string;
  city: string;
  address: string;
  image: string;
  tags: string[];
  rating: number;
  capacity: number;
  description?: string;
  schedule?: LocalSchedule[];
}

export interface LocalSchedule {
  day: string;
  openTime: string;
  closeTime: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  localId: string;
  localName?: string;
  city: string;
  ageRestriction: string;
  capacity: number;
  price: number;
  tags?: string[];
}

export interface Drink {
  id: string;
  name: string;
  price: number;
  description?: string;
  localId: string;
  category?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  favorites?: { locals: string[], events: string[] };
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  date: string;
  localName: string;
  price: number;
  quantity: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface CartItem {
  eventId: string;
  eventTitle: string;
  localName: string;
  date: string;
  price: number;
  quantity: number;
}

export interface CheckoutFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  gender?: string;
}

export interface AppContextState {
  selectedCity: City | null;
  cart: CartItem[];
  language: 'en' | 'es';
}
