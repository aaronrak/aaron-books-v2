"use client";

import Link from "next/link";
import { BookOpen, Heart, MapPin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-emerald-800" />
              <span className="text-lg font-bold text-slate-900">Aaron Books</span>
            </Link>
            <p className="text-sm text-slate-600">
              Soutenez les librairies independantes en achetant vos livres en ligne. 30% de chaque vente est reverse a votre librairie.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-slate-600 hover:text-emerald-800 transition-colors">Accueil</Link></li>
              <li><Link href="/livres" className="text-sm text-slate-600 hover:text-emerald-800 transition-colors">Livres</Link></li>
              <li><Link href="/librairies" className="text-sm text-slate-600 hover:text-emerald-800 transition-colors">Librairies</Link></li>
              <li><Link href="/panier" className="text-sm text-slate-600 hover:text-emerald-800 transition-colors">Panier</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/livres?categorie=romans" className="text-sm text-slate-600 hover:text-emerald-800 transition-colors">Romans</Link></li>
              <li><Link href="/livres?categorie=classiques" className="text-sm text-slate-600 hover:text-emerald-800 transition-colors">Classiques</Link></li>
              <li><Link href="/livres?categorie=philosophie" className="text-sm text-slate-600 hover:text-emerald-800 transition-colors">Philosophie</Link></li>
              <li><Link href="/livres?categorie=nouveautes" className="text-sm text-slate-600 hover:text-emerald-800 transition-colors">Nouveautes</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="h-4 w-4" />
                <span>contact@librairie-locale.fr</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4" />
                <span>France</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Aaron Books. Soutenez les librairies independantes.
          </p>
          <div className="flex items-center gap-4">
            <a href="/project-files.zip" download className="text-sm text-emerald-700 hover:text-emerald-800 font-medium">
              Télécharger les fichiers sources
            </a>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              Fait avec <Heart className="h-3 w-3 text-red-500 fill-red-500" /> pour les librairies
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
