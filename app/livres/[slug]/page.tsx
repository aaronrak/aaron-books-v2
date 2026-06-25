import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Book, Review } from "@/lib/supabase";
import { StarRating } from "@/components/star-rating";
import { AddToCart } from "@/components/add-to-cart";
import { BookCard } from "@/components/book-card";
import { ArrowLeft, BookOpen, Calendar, FileText, Globe, Tag, User } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getBook(slug: string) {
  const bookId = slug.split("-").pop();
  if (!bookId) return null;

  const { data: book } = await supabase
    .from("books")
    .select("*, author:authors(*), categories:book_categories(category:categories(*))")
    .eq("id", bookId)
    .eq("in_stock", true)
    .single();

  return book as Book | null;
}

async function getReviews(bookId: string) {
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("book_id", bookId)
    .order("created_at", { ascending: false });
  return data as Review[] | null;
}

async function getRelatedBooks(bookId: string, authorId: string | null) {
  let query = supabase
    .from("books")
    .select("*, author:authors(*)")
    .eq("in_stock", true)
    .neq("id", bookId)
    .limit(4);

  if (authorId) {
    query = query.eq("author_id", authorId);
  }

  const { data } = await query;
  return data as Book[] | null;
}

export default async function BookDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) return notFound();

  const reviews = await getReviews(book.id);
  const relatedBooks = await getRelatedBooks(book.id, book.author_id);

  const discount =
    book.original_price && book.original_price > book.price
      ? Math.round((1 - book.price / book.original_price) * 100)
      : null;

  const categories = book.categories?.map((c: any) => c.category).filter(Boolean) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link href="/livres" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Retour aux livres
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cover */}
        <div className="lg:col-span-4">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            {book.cover_image ? (
              <Image
                src={book.cover_image}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <BookOpen className="h-16 w-16" />
              </div>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{book.title}</h1>
            {book.subtitle && <p className="text-lg text-slate-600 mb-2">{book.subtitle}</p>}
            <div className="flex items-center gap-2">
              <Link href={`/auteurs/${book.author?.id}`} className="text-emerald-800 hover:underline font-medium">
                {book.author?.name}
              </Link>
              {book.publisher && (
                <>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">{book.publisher}</span>
                </>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <StarRating rating={book.rating || 0} showValue />
            <span className="text-sm text-slate-500">{book.review_count || 0} avis</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-slate-900">{book.price.toFixed(2)} &euro;</span>
            {book.original_price && book.original_price > book.price && (
              <>
                <span className="text-xl text-slate-500 line-through">{book.original_price.toFixed(2)} &euro;</span>
                {discount && (
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">-{discount}%</span>
                )}
              </>
            )}
          </div>

          {/* Add to cart */}
          <div className="flex items-center gap-4">
            <AddToCart bookId={book.id} />
          </div>

          {/* Description */}
          {book.description && (
            <div className="space-y-2">
              <h2 className="font-semibold text-slate-900">Description</h2>
              <p className="text-slate-600 leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 rounded-lg p-4">
            {book.isbn && (
              <div className="flex items-start gap-2">
                <Tag className="h-4 w-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs text-slate-500">ISBN</p>
                  <p className="text-sm font-medium text-slate-900">{book.isbn}</p>
                </div>
              </div>
            )}
            {book.format && (
              <div className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs text-slate-500">Format</p>
                  <p className="text-sm font-medium text-slate-900 capitalize">{book.format}</p>
                </div>
              </div>
            )}
            {book.page_count && (
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs text-slate-500">Pages</p>
                  <p className="text-sm font-medium text-slate-900">{book.page_count}</p>
                </div>
              </div>
            )}
            {book.language && (
              <div className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs text-slate-500">Langue</p>
                  <p className="text-sm font-medium text-slate-900">{book.language === "fr" ? "Francais" : book.language}</p>
                </div>
              </div>
            )}
            {book.publication_date && (
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs text-slate-500">Parution</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(book.publication_date).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
                  </p>
                </div>
              </div>
            )}
            {categories.length > 0 && (
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs text-slate-500">Categories</p>
                  <div className="flex flex-wrap gap-1">
                    {categories.map((cat: any) => (
                      <Link
                        key={cat.id}
                        href={`/livres?categorie=${cat.slug}`}
                        className="text-sm font-medium text-emerald-800 hover:underline"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Avis clients</h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{review.reviewer_name}</span>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(review.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                {review.comment && <p className="text-slate-600">{review.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600">Aucun avis pour le moment. Soyez le premier a commenter !</p>
        )}
      </div>

      {/* Related books */}
      {relatedBooks && relatedBooks.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Du meme auteur</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedBooks.map((book) => (
              <BookCard key={book.id} book={book as any} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
