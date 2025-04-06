import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import TokenManager from '../services/TokenManager';

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

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>(() => {
    const token = TokenManager.getAccessToken();
    const savedUser = localStorage.getItem('user');
    
    return {
      isAuthenticated: !!token,
      user: savedUser ? JSON.parse(savedUser) : null,
      token
    };
  });

  useEffect(() => {
    // Set navigate function in AuthService
    AuthService.setNavigate(navigate);
    
    // Initialize AuthService and verify token
    const initAuth = async () => {
      try {
        console.log('Initializing auth service...');
        await AuthService.initialize();
        
        const isValid = await AuthService.validateToken();
        console.log('Token validation result:', isValid);
        
        if (isValid) {
          try {
            const user = await getCurrentUser();
            const token = TokenManager.getAccessToken();
            
            setState({
              isAuthenticated: true,
              user,
              token
            });
            
            console.log('User authenticated:', user.name);
          } catch (error) {
            console.error('Error verifying authentication:', error);
            setState({
              isAuthenticated: false,
              user: null,
              token: null
            });
          }
        } else if (state.isAuthenticated) {
          // Token invalid but state shows authenticated - update state
          console.log('Token invalid, updating state');
          setState({
            isAuthenticated: false,
            user: null,
            token: null
          });
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      }
    };
    
    initAuth();
  }, [navigate]);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      console.log('Login attempt for:', email, 'with rememberMe:', rememberMe);
      const { token, user } = await apiLogin(email, password);
      
      console.log('Login successful, token received:', token ? token.substring(0, 10) + '...' : 'No token');
      console.log('User data received:', user ? user.name : 'No user data');
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      setState({
        isAuthenticated: true,
        user,
        token
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
      
      navigate('/home');
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
    AuthService.logout().catch(error => {
      console.error('Logout error:', error);
    });
    
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
        register: async () => {},
        logout: () => {},
        toggleFavorite: async () => {}
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
