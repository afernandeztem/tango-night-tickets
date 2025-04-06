
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../models/types';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/api';
import { useToast } from '@/hooks/use-toast';

// Create context with default values
const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
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
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    return {
      isAuthenticated: !!token,
      user: savedUser ? JSON.parse(savedUser) : null,
      token
    };
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const user = await getCurrentUser();
          setState({
            isAuthenticated: true,
            user,
            token
          });
        } catch (error) {
          console.error('Error verifying authentication:', error);
          // Clear invalid auth data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setState({
            isAuthenticated: false,
            user: null,
            token: null
          });
        }
      }
    };
    
    checkAuth();
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
  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await apiLogin(email, password);
      
      setState({
        isAuthenticated: true,
        user,
        token
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    try {
      const user = await apiRegister(data);
      
      // After registration, automatically log in
      const { token } = await apiLogin(data.email, data.password);
      
      setState({
        isAuthenticated: true,
        user,
        token
      });
      
      toast({
        title: "Registration successful",
        description: `Welcome to TangoApp, ${user.name}!`,
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
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
      // Make API call to toggle favorite
      const updatedUser = await import('../services/api').then(api => 
        api.toggleFavorite(type, id)
      );
      
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
