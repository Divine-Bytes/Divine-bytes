'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { CartItem, CustomizationData } from '@/types';

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: CartItem[] };

interface CartState {
  items: CartItem[];
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const STORAGE_KEY = 'divine-bytes-cart';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { items: action.payload };
    case 'ADD_ITEM': {
      const item = action.payload;
      if (!item.name?.trim()) return state;
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return { items: state.items.map((i) => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i) };
      }
      return { items: [...state.items, item] };
    }
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) return { items: state.items.filter((i) => i.productId !== productId) };
      return { items: state.items.map((i) => i.productId === productId ? { ...i, quantity } : i) };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.productId !== action.payload.productId) };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) dispatch({ type: 'HYDRATE', payload: parsed });
      }
    } catch { /* ignore */ }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      // Exclude File objects — not serializable. The URL is stored separately as inspirationImageUrl.
      const serializable = state.items.map((item) => ({
        ...item,
        customization: item.customization
          ? { ...item.customization, inspirationImage: null }
          : undefined,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch { /* ignore */ }
  }, [state.items]);

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextValue = {
    items: state.items,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    updateItem: (productId, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } }),
    removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', payload: { productId } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    total,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
