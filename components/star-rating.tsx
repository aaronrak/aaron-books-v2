"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export function StarRating({ rating, size = "md", showValue = false }: StarRatingProps) {
  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`${sizeClass[size]} text-amber-400 fill-amber-400`} />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className={`${sizeClass[size]} text-slate-300 fill-slate-300`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${sizeClass[size]} text-amber-400 fill-amber-400`} />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${sizeClass[size]} text-slate-300 fill-slate-300`} />
      ))}
      {showValue && (
        <span className="text-sm text-slate-600 ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
