
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const AUTH_ENDPOINTS = {
  TOKEN: '/oauth/token',
  LOGIN: '/oauth/login',
  REGISTER: '/public/new_user',
  CURRENT_USER: '/api/users/self',
};

export const REQUEST_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
};
