"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Book } from "@/lib/supabase";
import { StarRating } from "@/components/star-rating";
import { ShoppingCart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { toast } from "sonner";

interface BookCardProps {
  book: Book;
  showAddToCart?: boolean;
}

export function BookCard({ book, showAddToCart = true }: BookCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const slug = book.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const detailUrl = `/livres/${slug}-${book.id}`;

  const discount = book.original_price && book.original_price > book.price
    ? Math.round((1 - book.price / book.original_price) * 100)
    : null;

  const handleCardClick = () => {
    router.push(detailUrl);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.author?.id) {
      router.push(`/auteurs/${book.author.id}`);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addItem(book.id);
    toast.success("Ajoute au panier !");
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Cover image */}
      <div className="block relative aspect-[2/3] overflow-hidden bg-slate-100">
        {book.cover_image ? (
          <Image
            src={book.cover_image}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
            <BookOpen className="h-12 w-12 mb-2" />
            <span className="text-xs text-slate-500">Pas de couverture</span>
          </div>
        )}
        {discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        <span className="absolute bottom-2 right-2 bg-white/90 text-slate-700 text-xs font-medium px-2 py-1 rounded capitalize">
          {book.format}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-emerald-800 transition-colors">
          {book.title}
        </h3>
        <span
          onClick={handleAuthorClick}
          className="block text-sm text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          {book.author?.name}
        </span>

        <div className="flex items-center gap-1.5">
          <StarRating rating={book.rating || 0} size="sm" />
          <span className="text-xs text-slate-500">({book.review_count || 0})</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">{book.price.toFixed(2)} &euro;</span>
            {book.original_price && book.original_price > book.price && (
              <span className="text-sm text-slate-500 line-through">{book.original_price.toFixed(2)} &euro;</span>
            )}
          </div>

          {showAddToCart && (
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
