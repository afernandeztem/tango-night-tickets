
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { City, CartItem, AppContextState } from '../types';

// Create context with default values
const AppContext = createContext<{
  state: AppContextState;
  setSelectedCity: (city: City) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (eventId: string) => void;
  updateCartItemQuantity: (eventId: string, quantity: number) => void;
  clearCart: () => void;
  setLanguage: (language: 'en' | 'es') => void;
}>({
  state: {
    selectedCity: null,
    cart: [],
    language: 'en'
  },
  setSelectedCity: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
  clearCart: () => {},
  setLanguage: () => {}
});

// Custom hook to use app context
export const useApp = () => useContext(AppContext);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppContextState>(() => {
    // Load initial state from localStorage if available
    const savedCity = localStorage.getItem('selectedCity');
    const savedCart = localStorage.getItem('cart');
    const savedLanguage = localStorage.getItem('language') as 'en' | 'es';
    
    return {
      selectedCity: savedCity ? JSON.parse(savedCity) : null,
      cart: savedCart ? JSON.parse(savedCart) : [],
      language: savedLanguage || 'en'
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (state.selectedCity) {
      localStorage.setItem('selectedCity', JSON.stringify(state.selectedCity));
    }
    localStorage.setItem('cart', JSON.stringify(state.cart));
    localStorage.setItem('language', state.language);
  }, [state]);

  // Actions for modifying state
  const setSelectedCity = (city: City) => {
    setState(prevState => ({
      ...prevState,
      selectedCity: city
    }));
  };

  const addToCart = (item: CartItem) => {
    setState(prevState => {
      // Check if item is already in cart
      const existingItemIndex = prevState.cart.findIndex(
        cartItem => cartItem.eventId === item.eventId
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedCart = [...prevState.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + item.quantity
        };
        return { ...prevState, cart: updatedCart };
      } else {
        // Add new item
        return { ...prevState, cart: [...prevState.cart, item] };
      }
    });
  };

  const removeFromCart = (eventId: string) => {
    setState(prevState => ({
      ...prevState,
      cart: prevState.cart.filter(item => item.eventId !== eventId)
    }));
  };

  const updateCartItemQuantity = (eventId: string, quantity: number) => {
    setState(prevState => ({
      ...prevState,
      cart: prevState.cart.map(item => 
        item.eventId === eventId ? { ...item, quantity } : item
      )
    }));
  };

  const clearCart = () => {
    setState(prevState => ({
      ...prevState,
      cart: []
    }));
  };

  const setLanguage = (language: 'en' | 'es') => {
    setState(prevState => ({
      ...prevState,
      language
    }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setSelectedCity,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        setLanguage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
