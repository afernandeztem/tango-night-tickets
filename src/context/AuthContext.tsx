
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';
import { login as apiLogin, register as apiRegister, getUserProfile } from '../services/api';
import { toast } from '@/hooks/use-toast';

interface AuthContextProps {
  auth: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  addFavorite: (type: 'events' | 'locals', id: string) => void;
  removeFavorite: (type: 'events' | 'locals', id: string) => void;
}

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    return {
      isAuthenticated: !!token,
      user: null,
      token
    };
  });

  // Fetch user profile if authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (auth.isAuthenticated && auth.token && !auth.user) {
        try {
          const user = await getUserProfile();
          setAuth(prev => ({ ...prev, user }));
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // If unable to fetch profile, log the user out
          logout();
        }
      }
    };

    fetchUserProfile();
  }, [auth.isAuthenticated, auth.token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { token } = await apiLogin(email, password);
      localStorage.setItem('token', token);
      setAuth({
        isAuthenticated: true,
        user: null, // Will be fetched by the effect
        token
      });
      toast({
        title: "Login successful",
        description: "Welcome back to TangoApp!",
      });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    phone?: string
  ): Promise<boolean> => {
    try {
      await apiRegister({ name, email, password, phone });
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
      // Automatically log the user in after successful registration
      return await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration failed",
        description: "Please check your information and try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null
    });
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Add to favorites
  const addFavorite = (type: 'events' | 'locals', id: string) => {
    setAuth(prev => {
      if (!prev.user) return prev;
      
      const updatedFavorites = { 
        ...prev.user.favorites || { locals: [], events: [] }
      };
      
      if (!updatedFavorites[type].includes(id)) {
        updatedFavorites[type] = [...updatedFavorites[type], id];
      }
      
      return {
        ...prev,
        user: {
          ...prev.user,
          favorites: updatedFavorites
        }
      };
    });
  };

  // Remove from favorites
  const removeFavorite = (type: 'events' | 'locals', id: string) => {
    setAuth(prev => {
      if (!prev.user) return prev;
      
      const updatedFavorites = { 
        ...prev.user.favorites || { locals: [], events: [] }
      };
      
      updatedFavorites[type] = updatedFavorites[type].filter(itemId => itemId !== id);
      
      return {
        ...prev,
        user: {
          ...prev.user,
          favorites: updatedFavorites
        }
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        register,
        logout,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
