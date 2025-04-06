
export interface ErrorResponseWithDescription {
  error: string;
  error_description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  favorites?: {
    locals: string[];
    events: string[];
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TokenResponseDto {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  jti: string;
}

// AuthMessage interface that was referenced in login service
export interface AuthMessage extends TokenResponseDto {
  // All properties are inherited from TokenResponseDto
}

// Additional types for API responses
export interface City {
  id: string;
  name: string;
  displayName?: string;
  originalName?: string;
  image?: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  };
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  image?: string;
  city: string;
  localId: string;
  localName: string;
  capacity?: number;
  ageRestriction?: string;
}

export interface Local {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  image?: string;
  capacity?: number;
}

export interface Drink {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  validUntil?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface TicketOffer {
  id: string;
  name: string;
  price: number;
  quantity: number;
  available: number;
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  date: string;
  quantity: number;
  status: string;
}
