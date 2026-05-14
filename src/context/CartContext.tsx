import React, { createContext, useContext, useState } from 'react';

export type CartItem = {
  offeringId: string;
  subjectCode: string;
  subjectTitle: string;
  units: number;
  schedule: string | null;
  instructor: string | null;
  section: string;
};

export type CartContextValue = {
  items: CartItem[];
  totalUnits: number;
  addItem: (item: CartItem) => { success: boolean; error?: string };
  removeItem: (offeringId: string) => void;
  clearCart: () => void;
  hasItem: (offeringId: string) => boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const totalUnits = items.reduce((sum, item) => sum + item.units, 0);

  const addItem = (item: CartItem): { success: boolean; error?: string } => {
    if (items.some((i) => i.offeringId === item.offeringId)) {
      return { success: true };
    }
    if (totalUnits + item.units > 24) {
      return { success: false, error: 'Unit limit of 24 reached' };
    }
    setItems((prev) => [...prev, item]);
    return { success: true };
  };

  const removeItem = (offeringId: string) => {
    setItems((prev) => prev.filter((i) => i.offeringId !== offeringId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const hasItem = (offeringId: string): boolean => {
    return items.some((i) => i.offeringId === offeringId);
  };

  return (
    <CartContext.Provider value={{ items, totalUnits, addItem, removeItem, clearCart, hasItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
