import { supabase } from "@/lib/supabase";
import { BookCard } from "@/components/book-card";
import { BookstoreCard } from "@/components/bookstore-card";
import { SearchHero } from "@/components/search-hero";
import { BookOpen, Heart, Truck, Shield } from "lucide-react";

async function getHomepageData() {
  const { data: featuredBooks } = await supabase
    .from("featured_list_books")
    .select("book:books(*, author:authors(*), categories:book_categories(category:categories(*)))")
    .eq("list_id", "b91d8019-4bd9-4b5c-94bb-e877513b1684")
    .order("position");

  const { data: newBooks } = await supabase
    .from("featured_list_books")
    .select("book:books(*, author:authors(*))")
    .eq("list_id", "394dce01-2682-48a4-89d8-2eea5d45e503")
    .order("position");

  const { data: bookstores } = await supabase
    .from("bookstores")
    .select("*")
    .eq("featured", true)
    .eq("is_active", true)
    .limit(3);

  const { data: allBooks } = await supabase
    .from("books")
    .select("*, author:authors(*)")
    .eq("in_stock", true)
    .order("rating", { ascending: false })
    .limit(8);

  const fbBooks = (featuredBooks as any[])?.map((fb) => {
    const bookData: any = fb.book || {};
    return {
      ...bookData,
      categories: bookData.categories?.map((c: any) => c.category).filter(Boolean) || [],
    };
  }) || [];

  const nbBooks = (newBooks as any[])?.map((nb) => nb.book) || [];

  return {
    featuredBooks: fbBooks,
    newBooks: nbBooks,
    bookstores: bookstores || [],
    allBooks: allBooks || [],
  };
}

export default async function HomePage() {
  const { featuredBooks, newBooks, bookstores, allBooks } = await getHomepageData();

  return (
    <div>
      {/* Hero */}
      <SearchHero />

      {/* Value props */}
      <section className="bg-slate-50 py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-emerald-800" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Catalogue complet</h3>
                <p className="text-sm text-slate-600">Des milliers de titres disponibles</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-emerald-800" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Soutien local</h3>
                <p className="text-sm text-slate-600">30% reverse aux librairies</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Truck className="h-6 w-6 text-emerald-800" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Livraison rapide</h3>
                <p className="text-sm text-slate-600">2-3 jours ouvrés</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-emerald-800" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Paiement sécurisé</h3>
                <p className="text-sm text-slate-600">Stripe & SSL</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured books */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Nos Coups de Coeur</h2>
            <a href="/livres" className="text-emerald-800 hover:text-emerald-900 font-medium text-sm">
              Voir tous les livres →
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book: any) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured bookstores */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Librairies Partenaires</h2>
            <a href="/librairies" className="text-emerald-800 hover:text-emerald-900 font-medium text-sm">
              Voir toutes les librairies →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bookstores.map((bookstore) => (
              <BookstoreCard key={bookstore.id} bookstore={bookstore} />
            ))}
          </div>
        </div>
      </section>

      {/* New releases */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Nouveautes</h2>
            <a href="/livres?categorie=nouveautes" className="text-emerald-800 hover:text-emerald-900 font-medium text-sm">
              Voir les nouveautes →
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {newBooks.map((book: any) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* All books */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Meilleures notes</h2>
            <a href="/livres" className="text-emerald-800 hover:text-emerald-900 font-medium text-sm">
              Explorer →
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {allBooks.map((book) => (
              <BookCard key={book.id} book={book as any} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
