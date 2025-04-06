
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
