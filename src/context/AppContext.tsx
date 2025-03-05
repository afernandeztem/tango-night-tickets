
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { City, CartItem, AppContextState } from '../types';

interface AppContextProps {
  state: AppContextState;
  setSelectedCity: (city: City) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (eventId: string) => void;
  clearCart: () => void;
  setLanguage: (lang: 'en' | 'es') => void;
}

const defaultState: AppContextState = {
  selectedCity: null,
  cart: [],
  language: 'en'
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppContextState>(() => {
    // Load state from localStorage if available
    const savedCity = localStorage.getItem('selectedCity');
    const savedCart = localStorage.getItem('cart');
    const savedLanguage = localStorage.getItem('language');
    
    return {
      selectedCity: savedCity ? JSON.parse(savedCity) : null,
      cart: savedCart ? JSON.parse(savedCart) : [],
      language: (savedLanguage as 'en' | 'es') || 'en'
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedCity', JSON.stringify(state.selectedCity));
    localStorage.setItem('cart', JSON.stringify(state.cart));
    localStorage.setItem('language', state.language);
  }, [state]);

  // Function to set the selected city
  const setSelectedCity = (city: City) => {
    setState(prev => ({ ...prev, selectedCity: city }));
  };

  // Function to add an item to the cart
  const addToCart = (item: CartItem) => {
    setState(prev => {
      // Check if the item is already in the cart
      const existingItemIndex = prev.cart.findIndex(cartItem => cartItem.eventId === item.eventId);
      
      if (existingItemIndex > -1) {
        // If it exists, update the quantity
        const updatedCart = [...prev.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + item.quantity
        };
        return { ...prev, cart: updatedCart };
      } else {
        // If it doesn't exist, add it to the cart
        return { ...prev, cart: [...prev.cart, item] };
      }
    });
  };

  // Function to remove an item from the cart
  const removeFromCart = (eventId: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.eventId !== eventId)
    }));
  };

  // Function to clear the cart
  const clearCart = () => {
    setState(prev => ({ ...prev, cart: [] }));
  };

  // Function to set the language
  const setLanguage = (lang: 'en' | 'es') => {
    setState(prev => ({ ...prev, language: lang }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setSelectedCity,
        addToCart,
        removeFromCart,
        clearCart,
        setLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
