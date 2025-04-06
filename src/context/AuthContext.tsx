import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  signInWithGoogle, 
  signInWithApple, 
  signOut as firebaseSignOut,
  getCurrentFirebaseUser
} from '../firebase/firebase';
import { mapFirebaseUserToAppUser } from '../firebase/authUtils';

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  toggleFavorite: (type: 'local' | 'event', id: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
}>({
  state: {
    isAuthenticated: false,
    user: null,
    token: null
  },
  login: async () => {},
  register: async () => {},
  logout: () => {},
  toggleFavorite: async () => {},
  loginWithGoogle: async () => {},
  loginWithApple: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    return {
      isAuthenticated: !!token,
      user: savedUser ? JSON.parse(savedUser) : null,
      token
    };
  });

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

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);

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
    firebaseSignOut().catch(error => {
      console.error('Firebase sign out error:', error);
    });
    
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

  const loginWithGoogle = async () => {
    try {
      const userCredential = await signInWithGoogle();
      const firebaseUser = userCredential.user;
      
      const user = await mapFirebaseUserToAppUser(firebaseUser);
      
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('token', token);
      
      setState({
        isAuthenticated: true,
        user,
        token
      });
      
      toast({
        title: "Login successful",
        description: `Welcome, ${user.name}!`,
      });
    } catch (error: any) {
      console.error('Google login error:', error);
      
      let errorMessage = "Could not sign in with Google. Please try again.";
      if (error.message && error.message.includes('unauthorized-domain')) {
        errorMessage = "This website domain is not authorized in Firebase. Please contact support.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  };

  const loginWithApple = async () => {
    try {
      const userCredential = await signInWithApple();
      const firebaseUser = userCredential.user;
      
      const user = await mapFirebaseUserToAppUser(firebaseUser);
      
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('token', token);
      
      setState({
        isAuthenticated: true,
        user,
        token
      });
      
      toast({
        title: "Login successful",
        description: `Welcome, ${user.name}!`,
      });
    } catch (error: any) {
      console.error('Apple login error:', error);
      
      let errorMessage = "Could not sign in with Apple. Please try again.";
      if (error.message && error.message.includes('unauthorized-domain')) {
        errorMessage = "This website domain is not authorized in Firebase. Please contact support.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
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
        register,
        logout,
        toggleFavorite,
        loginWithGoogle,
        loginWithApple
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
