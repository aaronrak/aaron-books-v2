import { supabase } from "@/lib/supabase";
import { BookCard } from "@/components/book-card";
import { Search } from "lucide-react";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = (params?.q as string) || "";

  let bookQuery = supabase
    .from("books")
    .select("*, author:authors(*)")
    .eq("in_stock", true);

  if (query.trim()) {
    bookQuery = bookQuery.or(`title.ilike.%${query}%,isbn.ilike.%${query}%`);
  }

  const { data: books } = await bookQuery.order("rating", { ascending: false }).limit(24);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Search className="h-5 w-5 text-slate-400" />
        <h1 className="text-2xl font-bold text-slate-900">
          {query.trim() ? `Resultats pour "${query}"` : "Recherche"}
        </h1>
        <span className="text-sm text-slate-500">({books?.length || 0} resultats)</span>
      </div>

      {books && books.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg text-slate-600">
            {query.trim()
              ? `Aucun resultat pour "${query}"`
              : "Entrez un terme de recherche pour trouver des livres"}
          </p>
          <a href="/livres" className="text-emerald-800 hover:underline mt-4 inline-block">
            Parcourir tous les livres
          </a>
        </div>
      )}
    </div>
  );
}
