"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Truck, CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, total, clearCart, selectedBookstore } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
  });

  const shippingCost = total > 35 ? 0 : 4.99;
  const grandTotal = total + shippingCost;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Votre panier est vide</h1>
        <Button onClick={() => router.push("/livres")} className="bg-emerald-700 hover:bg-emerald-800 text-white">
          Parcourir les livres
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const sessionId = localStorage.getItem("bookshop_session_id") || crypto.randomUUID();
      const orderNumber = `CMD-${Date.now().toString(36).toUpperCase()}`;
      const bookstoreCommission = items.reduce((sum, item) => {
        const price = item.book?.price || 0;
        return sum + price * item.quantity * 0.30;
      }, 0);

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          session_id: sessionId,
          customer_email: formData.email,
          customer_first_name: formData.firstName,
          customer_last_name: formData.lastName,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_postal_code: formData.postalCode,
          shipping_country: formData.country,
          total_amount: grandTotal,
          bookstore_commission: bookstoreCommission,
          status: "pending",
          payment_status: "paid",
        })
        .select()
        .single();

      if (orderError || !order) {
        throw new Error("Erreur lors de la creation de la commande");
      }

      const orderItems = items.map((item) => ({
        order_id: order.id,
        book_id: item.book_id,
        book_title: item.book?.title || "",
        book_cover_image: item.book?.cover_image || null,
        quantity: item.quantity,
        unit_price: item.book?.price || 0,
        total_price: (item.book?.price || 0) * item.quantity,
        bookstore_id: selectedBookstore,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) {
        throw new Error("Erreur lors de l ajout des articles");
      }

      await clearCart();
      router.push(`/commande/confirmation?numero=${orderNumber}`);
    } catch (err) {
      toast.error("Erreur lors de la commande. Veuillez reessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => router.push("/panier")} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Retour au panier
      </button>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Passer la commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Contact</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Adresse de livraison</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prenom</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Code postal</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Paiement</h2>
              <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-4 border border-slate-200">
                <CreditCard className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Paiement a la livraison</p>
                  <p className="text-xs text-slate-500">Payez en especes ou carte a la reception de votre colis</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Shield className="h-4 w-4" />
              <span>Vos informations sont securisees et chiffrees</span>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3"
            >
              {isSubmitting ? "Traitement en cours..." : `Confirmer la commande - ${grandTotal.toFixed(2)} &euro;`}
            </Button>
          </form>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Recapitulatif</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => {
                const book = item.book;
                if (!book) return null;
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-16 rounded bg-slate-100 overflow-hidden shrink-0">
                      {book.cover_image && (
                        <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{book.title}</p>
                      <p className="text-xs text-slate-500">Qté: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">
                      {(book.price * item.quantity).toFixed(2)} &euro;
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Sous-total</span>
                <span className="font-medium">{total.toFixed(2)} &euro;</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Livraison</span>
                <span className="font-medium">
                  {shippingCost === 0 ? <span className="text-emerald-700">Gratuite</span> : `${shippingCost.toFixed(2)} &euro;`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-lg font-bold text-slate-900">{grandTotal.toFixed(2)} &euro;</span>
              </div>
            </div>

            {selectedBookstore && (
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-xs text-emerald-700">
                  <span className="font-semibold">Librairie selectionnee :</span> 30% de votre achat sera reverse.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
