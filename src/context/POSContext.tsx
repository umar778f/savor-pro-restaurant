import React, { createContext, useContext, useEffect, useState } from "react";
import { generateOrderNumber } from "../lib/utils";

export interface CartItem {
  id: string; // matches menu item id for easy tracking
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: "completed" | "pending";
  date: string; // ISO string
}

interface POSContextType {
  cart: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  total: number;
  orders: Order[];
  addOrder: (paymentMethod: string) => Order;
  deleteOrder: (id: string) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const TAX_RATE = 0.10; // 10%

export function POSProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("pos-orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("pos-orders", JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const addOrder = (paymentMethod: string) => {
    const newOrder: Order = {
      id: crypto.randomUUID(),
      orderNumber: generateOrderNumber(),
      items: [...cart],
      subtotal,
      tax,
      total,
      paymentMethod,
      status: "completed",
      date: new Date().toISOString()
    };
    
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <POSContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, 
      subtotal, tax, total, 
      orders, addOrder, deleteOrder 
    }}>
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error("usePOS must be used within a POSProvider");
  }
  return context;
}
