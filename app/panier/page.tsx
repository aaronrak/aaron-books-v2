"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart-provider";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, isLoading } = useCart();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-2 border-emerald-800 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-20">
          <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Votre panier est vide</h1>
          <p className="text-slate-600 mb-6">Decouvrez notre catalogue et ajoutez vos premiers livres.</p>
          <Link href="/livres">
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">
              Parcourir les livres
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = total > 35 ? 0 : 4.99;
  const grandTotal = total + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/livres" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Continuer les achats
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Votre panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const book = item.book;
            if (!book) return null;
            const slug = book.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

            return (
              <div key={item.id} className="flex gap-4 bg-white border border-slate-200 rounded-lg p-4">
                <Link href={`/livres/${slug}-${book.id}`} className="shrink-0">
                  <div className="relative w-24 h-36 rounded-lg overflow-hidden bg-slate-100">
                    {book.cover_image ? (
                      <Image src={book.cover_image} alt={book.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        Pas de couverture
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/livres/${slug}-${book.id}`}>
                    <h3 className="font-semibold text-slate-900 truncate hover:text-emerald-800 transition-colors">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate-600">{book.author?.name}</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{book.price.toFixed(2)} &euro;</p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button
                        onClick={() => {
                          setIsUpdating(item.id);
                          updateQuantity(item.id, item.quantity - 1).finally(() => setIsUpdating(null));
                        }}
                        disabled={isUpdating === item.id}
                        className="px-3 py-1.5 hover:bg-slate-50 text-slate-600 disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => {
                          setIsUpdating(item.id);
                          updateQuantity(item.id, item.quantity + 1).finally(() => setIsUpdating(null));
                        }}
                        disabled={isUpdating === item.id}
                        className="px-3 py-1.5 hover:bg-slate-50 text-slate-600 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        toast.success("Supprime du panier");
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    {(book.price * item.quantity).toFixed(2)} &euro;
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Recapitulatif</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Sous-total</span>
                <span className="font-medium">{total.toFixed(2)} &euro;</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Livraison</span>
                <span className="font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-700">Gratuite</span>
                  ) : (
                    `${shippingCost.toFixed(2)} &euro;`
                  )}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  Livraison gratuite des {(35 - total).toFixed(2)} &euro; d achats
                </p>
              )}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-xl font-bold text-slate-900">{grandTotal.toFixed(2)} &euro;</span>
              </div>
            </div>

            <Button
              onClick={() => router.push("/checkout")}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3"
            >
              Passer la commande
            </Button>

            <p className="text-xs text-slate-500 mt-3 text-center">
              30% de votre achat sera reverse a votre librairie selectionnee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
