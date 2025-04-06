
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { useToast } from '@/hooks/use-toast';
import LoginService from '../services/LoginService';
import AuthService from '../services/AuthService';
import TokenManager from '../services/TokenManager';

// Create context with default values
const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  toggleFavorite: (type: 'local' | 'event', id: string) => Promise<void>;
}>({
  state: {
    isAuthenticated: false,
    user: null,
    token: null
  },
  login: async () => {},
  register: async () => {},
  logout: () => {},
  toggleFavorite: async () => {}
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>(() => {
    // Load initial state from localStorage
    const token = TokenManager.getAccessToken();
    const savedUser = localStorage.getItem('user');
    
    return {
      isAuthenticated: !!token,
      user: savedUser ? JSON.parse(savedUser) : null,
      token
    };
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing auth...');
      
      // Initialize AuthService first
      await AuthService.initialize();
      
      const isValid = await AuthService.validateToken();
      console.log('Token valid?', isValid);
      
      if (isValid) {
        // Try to fetch user data
        try {
          const token = TokenManager.getAccessToken();
          let user = state.user;
          
          // If no user in state, try to get from localStorage
          if (!user) {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
              user = JSON.parse(savedUser);
            }
          }
          
          // If still no user, create a minimal one for now
          if (!user && token) {
            // Create minimal user object based on token
            try {
              const base64Url = token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const payload = JSON.parse(jsonPayload);
              
              user = {
                id: payload.sub || 'unknown',
                name: payload.user_name || 'User',
                email: payload.user_name || 'unknown@example.com',
                favorites: {
                  locals: [],
                  events: []
                }
              };
              
              localStorage.setItem('user', JSON.stringify(user));
            } catch (e) {
              console.error('Error parsing token for user data:', e);
            }
          }
          
          setState({
            isAuthenticated: true,
            user,
            token
          });
        } catch (error) {
          console.error('Error verifying authentication:', error);
          // Clear invalid auth data
          TokenManager.clearTokens();
          localStorage.removeItem('user');
          setState({
            isAuthenticated: false,
            user: null,
            token: null
          });
        }
      } else {
        // No valid token
        TokenManager.clearTokens();
        localStorage.removeItem('user');
        setState({
          isAuthenticated: false,
          user: null,
          token: null
        });
      }
    };
    
    initializeAuth();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);

  // Auth actions
  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      console.log('Attempting login...');
      
      // Clear any existing tokens before login
      TokenManager.clearTokens();
      
      // Perform login
      const authResponse = await LoginService.login({
        username: email,
        password: password,
        rememberMe
      });
      
      console.log('Login successful, tokens received');
      
      // Create minimal user object
      const user: User = {
        id: 'temp-id', // Will be updated when API call succeeds
        name: email.split('@')[0], // Temporary name from email
        email: email,
        favorites: {
          locals: [],
          events: []
        }
      };
      
      // Try to get user info from token
      try {
        const token = authResponse.access_token;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        user.id = payload.sub || user.id;
        user.name = payload.name || payload.user_name || user.name;
      } catch (e) {
        console.error('Error parsing token for user info:', e);
      }
      
      // Update state
      setState({
        isAuthenticated: true,
        user,
        token: authResponse.access_token
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    try {
      // For now, direct register not implemented - would call API
      // After registration, automatically log in
      await login(data.email, data.password);
      
      // Update the user name after login
      setState(prevState => ({
        ...prevState,
        user: prevState.user ? { 
          ...prevState.user,
          name: data.name,
          phone: data.phone
        } : null
      }));
      
      toast({
        title: "Registration successful",
        description: `Welcome to TangoApp, ${data.name}!`,
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Could not create your account. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    
    setState({
      isAuthenticated: false,
      user: null,
      token: null
    });
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const toggleFavorite = async (type: 'local' | 'event', id: string) => {
    if (!state.isAuthenticated || !state.user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add favorites.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Make API call to toggle favorite - for now we'll simulate locally
      const updatedUser = { ...state.user };
      const favorites = updatedUser.favorites || { locals: [], events: [] };
      
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
      
      updatedUser.favorites = favorites;
      
      setState(prevState => ({
        ...prevState,
        user: updatedUser
      }));
      
      const isFavorite = type === 'local' 
        ? updatedUser.favorites?.locals.includes(id)
        : updatedUser.favorites?.events.includes(id);
      
      toast({
        title: isFavorite ? "Added to favorites" : "Removed from favorites",
        description: isFavorite 
          ? `This ${type} has been added to your favorites.`
          : `This ${type} has been removed from your favorites.`,
      });
    } catch (error) {
      console.error(`Error toggling ${type} favorite:`, error);
      toast({
        title: "Error",
        description: `Could not update your favorites. Please try again.`,
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        toggleFavorite
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
