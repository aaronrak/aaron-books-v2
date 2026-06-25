import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Book, Author } from "@/lib/supabase";
import { BookCard } from "@/components/book-card";
import { ArrowLeft, BookOpen, User } from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getAuthor(id: string) {
  const { data: author } = await supabase
    .from("authors")
    .select("*")
    .eq("id", id)
    .single();

  return author as Author | null;
}

async function getAuthorBooks(authorId: string) {
  const { data: books } = await supabase
    .from("books")
    .select("*, categories:book_categories(category:categories(*))")
    .eq("author_id", authorId)
    .eq("in_stock", true)
    .order("rating", { ascending: false });

  return (books as any[]) || null;
}

export default async function AuthorPage({ params }: PageProps) {
  const { id } = await params;
  const author = await getAuthor(id);
  if (!author) return notFound();

  const books = await getAuthorBooks(id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link
        href="/livres"
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux livres
      </Link>

      {/* Author Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Author Photo */}
        <div className="md:col-span-1">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 max-w-sm mx-auto">
            {author.photo_url ? (
              <Image
                src={author.photo_url}
                alt={author.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <User className="h-20 w-20" />
              </div>
            )}
          </div>
        </div>

        {/* Author Info */}
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">{author.name}</h1>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <BookOpen className="h-4 w-4" />
            <span>{books?.length || 0} livre(s) disponible(s)</span>
          </div>

          {author.bio ? (
            <div className="space-y-2">
              <h2 className="font-semibold text-slate-900">Biographie</h2>
              <p className="text-slate-600 leading-relaxed">{author.bio}</p>
            </div>
          ) : (
            <p className="text-slate-500 italic">
              Biographie en cours de redaction.
            </p>
          )}
        </div>
      </div>

      {/* Books by Author */}
      {books && books.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Livres de {author.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={{
                  ...book,
                  author: author,
                  categories: book.categories?.map((c: any) => c.category).filter(Boolean) || [],
                }}
              />
            ))}
          </div>
        </div>
      )}

      {(!books || books.length === 0) && (
        <div className="text-center py-12">
          <p className="text-lg text-slate-600">
            Aucun livre disponible pour cet auteur actuellement.
          </p>
          <Link
            href="/livres"
            className="text-emerald-800 hover:underline mt-2 inline-block"
          >
            Decouvrir tous les livres
          </Link>
        </div>
      )}
    </div>
  );
}
