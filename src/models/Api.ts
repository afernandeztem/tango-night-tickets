
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
