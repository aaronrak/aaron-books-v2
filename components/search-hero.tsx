"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchHero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const quickCategories = [
    { label: "Romans", slug: "romans" },
    { label: "Classiques", slug: "classiques" },
    { label: "Philosophie", slug: "philosophie" },
    { label: "Nouveautes", slug: "nouveautes" },
  ];

  return (
    <section className="relative min-h-[520px] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Bannière librairie"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Gradient accent at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-black/30" />
      </div>

      {/* Floating particles / decorative overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse" />
        <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-24 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-20 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-20 lg:py-28">
        {/* Small tagline */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-white/90">30% reverses aux librairies independantes</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-white drop-shadow-lg">
          Decouvrez votre prochaine lecture
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Achetez vos livres en ligne et soutenez les librairies independantes. Chaque achat compte.
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative flex items-center shadow-2xl shadow-black/30">
            <Search className="absolute left-4 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, auteur, ISBN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl bg-white/95 backdrop-blur-sm py-4 pl-12 pr-36 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-400/80 focus:bg-white text-lg transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg"
            >
              Rechercher
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm text-white/60">Populaire :</span>
          {quickCategories.map((cat) => (
            <a
              key={cat.slug}
              href={`/livres?categorie=${cat.slug}`}
              className="text-sm bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white px-4 py-1.5 rounded-full transition-all border border-white/10"
            >
              {cat.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
