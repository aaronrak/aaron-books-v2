"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddToCartProps {
  bookId: string;
}

export function AddToCart({ bookId }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      await addItem(bookId, quantity);
      toast.success("Ajoute au panier !");
      setQuantity(1);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-slate-200 rounded-lg">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-2 hover:bg-slate-50 text-slate-600"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="px-3 py-2 hover:bg-slate-50 text-slate-600"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <Button
        onClick={handleAdd}
        disabled={isAdding}
        className="bg-emerald-700 hover:bg-emerald-800 text-white"
      >
        {isAdding ? (
          <Check className="h-4 w-4 mr-2" />
        ) : (
          <ShoppingCart className="h-4 w-4 mr-2" />
        )}
        {isAdding ? "Ajoute !" : "Ajouter au panier"}
      </Button>
    </div>
  );
}
