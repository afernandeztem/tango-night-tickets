
export interface ErrorResponseWithDescription {
  error: string;
  error_description?: string;
}

export interface AuthMessage {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
  jti?: string;
}
