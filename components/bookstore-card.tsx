"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookstore } from "@/lib/supabase";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { toast } from "sonner";

interface BookstoreCardProps {
  bookstore: Bookstore;
}

export function BookstoreCard({ bookstore }: BookstoreCardProps) {
  const { selectedBookstore, setSelectedBookstore } = useCart();
  const isSelected = selectedBookstore === bookstore.id;

  const handleSelect = () => {
    setSelectedBookstore(bookstore.id);
    toast.success(`Vous soutenez maintenant ${bookstore.name} !`);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Cover image */}
      <div className="relative h-40 bg-slate-100">
        {bookstore.cover_image ? (
          <Image
            src={bookstore.cover_image}
            alt={bookstore.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <span className="text-sm">Librairie</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2">
            {bookstore.logo_url ? (
              <Image
                src={bookstore.logo_url}
                alt={bookstore.name}
                width={40}
                height={40}
                className="rounded-full bg-white"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-600 font-bold">
                {bookstore.name.charAt(0)}
              </div>
            )}
            <h3 className="text-white font-bold text-lg">{bookstore.name}</h3>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-slate-400" />
          <span>{bookstore.address}, {bookstore.city}</span>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2">{bookstore.bio}</p>

        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            onClick={handleSelect}
            className={isSelected 
              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" 
              : "bg-emerald-700 hover:bg-emerald-800 text-white"
            }
          >
            {isSelected ? "Sélectionnée" : "Soutenir cette librairie"}
          </Button>
          <Link href={`/librairies/${bookstore.slug}`}>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
