import { supabase } from "@/lib/supabase";
import { BookCard } from "@/components/book-card";
import { BookFilter } from "@/components/book-filter";
import { Search } from "lucide-react";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BooksPage({ searchParams }: PageProps) {
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  const categorySlug = searchParams?.categorie as string | undefined;
  const selectedCategory = categorySlug
    ? categories?.find((c) => c.slug === categorySlug)
    : null;

  let query = supabase
    .from("books")
    .select("*, author:authors(*), categories:book_categories(category:categories(*))")
    .eq("in_stock", true);

  if (selectedCategory) {
    query = query.eq("categories.category_id", selectedCategory.id);
  }

  const { data: books } = await query.order("rating", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Search className="h-5 w-5 text-slate-400" />
        <h1 className="text-2xl font-bold text-slate-900">
          {selectedCategory ? selectedCategory.name : "Tous les livres"}
        </h1>
        <span className="text-sm text-slate-500">({books?.length || 0} resultats)</span>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="w-64 shrink-0 hidden md:block">
          <BookFilter categories={categories || []} activeCategory={selectedCategory?.slug} />
        </aside>

        {/* Book grid */}
        <div className="flex-1">
          {books && books.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book: any) => (
                <BookCard
                  key={book.id}
                  book={{
                    ...book,
                    categories: book.categories?.map((c: any) => c.category).filter(Boolean) || [],
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-slate-600">Aucun livre trouvé dans cette categorie.</p>
              <a href="/livres" className="text-emerald-800 hover:underline mt-2 inline-block">
                Voir tous les livres
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
