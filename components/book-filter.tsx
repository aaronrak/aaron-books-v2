"use client";

import { useRouter } from "next/navigation";
import { Category } from "@/lib/supabase";

interface BookFilterProps {
  categories: Category[];
  activeCategory?: string;
}

export function BookFilter({ categories, activeCategory }: BookFilterProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900">Categories</h3>
      <div className="space-y-1">
        <button
          onClick={() => router.push("/livres")}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            !activeCategory
              ? "bg-emerald-50 text-emerald-800 font-medium"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Tous les livres
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => router.push(`/livres?categorie=${cat.slug}`)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              activeCategory === cat.slug
                ? "bg-emerald-50 text-emerald-800 font-medium"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
