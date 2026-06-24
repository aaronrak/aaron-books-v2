"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("numero") || "N/A";

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="mb-6">
        <CheckCircle className="h-20 w-20 text-emerald-600 mx-auto" />
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">Commande confirmee !</h1>
      <p className="text-lg text-slate-600 mb-2">
        Merci pour votre achat qui soutient les librairies independantes.
      </p>
      <p className="text-sm text-slate-500 mb-8">
        Votre numero de commande est <span className="font-semibold text-slate-900">{orderNumber}</span>
      </p>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8 text-left">
        <h2 className="font-semibold text-emerald-900 mb-3">Prochaines etapes</h2>
        <ul className="space-y-3 text-sm text-emerald-800">
          <li className="flex items-start gap-2">
            <Package className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Votre commande sera preparee et expediee dans les 2-3 jours ouvrables.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Un email de confirmation vous a ete envoye avec les details de votre commande.</span>
          </li>
          <li className="flex items-start gap-2">
            <Home className="h-4 w-4 mt-0.5 shrink-0" />
            <span>30% de votre achat a ete reverse a votre librairie selectionnee.</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/">
          <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">
            <Home className="h-4 w-4 mr-2" />
            Retour a l'accueil
          </Button>
        </Link>
        <Link href="/livres">
          <Button variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Continuer les achats
          </Button>
        </Link>
      </div>
    </div>
  );
}
