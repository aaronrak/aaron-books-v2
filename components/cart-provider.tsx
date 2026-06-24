"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { CartItem } from "@/lib/supabase";

interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  selectedBookstore: string | null;
  setSelectedBookstore: (id: string | null) => void;
  addItem: (bookId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("bookshop_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("bookshop_session_id", id);
  }
  return id;
}

function getBookstoreId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bookshop_selected_bookstore");
}

function setBookstoreId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) {
    localStorage.setItem("bookshop_selected_bookstore", id);
  } else {
    localStorage.removeItem("bookshop_selected_bookstore");
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedBookstore, setSelectedBookstoreState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    const sessionId = getSessionId();
    if (!sessionId) return;
    const { data, error } = await supabase
      .from("cart_items")
      .select("*, book:books(*, author:authors(*))")
      .eq("session_id", sessionId);
    if (!error && data) {
      setItems(data as CartItem[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const bsId = getBookstoreId();
    setSelectedBookstoreState(bsId);
    fetchCart();
  }, [fetchCart]);

  const setSelectedBookstore = useCallback((id: string | null) => {
    setSelectedBookstoreState(id);
    setBookstoreId(id);
  }, []);

  const addItem = useCallback(async (bookId: string, quantity: number = 1) => {
    const sessionId = getSessionId();
    const bookstoreId = getBookstoreId();
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("session_id", sessionId)
      .eq("book_id", bookId)
      .maybeSingle();
    if (existing) {
      await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({
        session_id: sessionId,
        book_id: bookId,
        quantity,
        bookstore_id: bookstoreId,
      });
    }
    await fetchCart();
  }, [fetchCart]);

  const removeItem = useCallback(async (itemId: string) => {
    await supabase.from("cart_items").delete().eq("id", itemId);
    await fetchCart();
  }, [fetchCart]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }
    await supabase.from("cart_items").update({ quantity, updated_at: new Date().toISOString() }).eq("id", itemId);
    await fetchCart();
  }, [fetchCart, removeItem]);

  const clearCart = useCallback(async () => {
    const sessionId = getSessionId();
    await supabase.from("cart_items").delete().eq("session_id", sessionId);
    await fetchCart();
  }, [fetchCart]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => {
    const price = item.book?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, count, total, selectedBookstore, setSelectedBookstore, addItem, removeItem, updateQuantity, clearCart, isLoading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
