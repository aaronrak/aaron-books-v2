import { notFound } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Bookstore } from "@/lib/supabase";
import { BookCard } from "@/components/book-card";
import { MapPin, Globe, Mail, Phone, ArrowLeft } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getBookstore(slug: string) {
  const { data } = await supabase
    .from("bookstores")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data as Bookstore | null;
}

async function getBookstoreBooks(bookstoreId: string) {
  const { data } = await supabase
    .from("books")
    .select("*, author:authors(*)")
    .eq("in_stock", true)
    .limit(8);
  return data as any[] | null;
}

export default async function BookstoreDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const bookstore = await getBookstore(slug);
  if (!bookstore) return notFound();

  const books = await getBookstoreBooks(bookstore.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <a href="/librairies" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Retour aux librairies
      </a>

      {/* Header */}
      <div className="relative rounded-xl overflow-hidden bg-slate-100 mb-8">
        <div className="relative h-56">
          {bookstore.cover_image ? (
            <Image src={bookstore.cover_image} alt={bookstore.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-emerald-800 to-teal-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end gap-4">
            {bookstore.logo_url ? (
              <Image
                src={bookstore.logo_url}
                alt={bookstore.name}
                width={80}
                height={80}
                className="rounded-xl bg-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center text-2xl font-bold text-slate-700">
                {bookstore.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">{bookstore.name}</h1>
              <p className="text-emerald-100 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {bookstore.address}, {bookstore.city}, {bookstore.country}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-6">
          {bookstore.bio && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">A propos</h2>
              <p className="text-slate-600 leading-relaxed">{bookstore.bio}</p>
            </div>
          )}

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h3 className="font-semibold text-emerald-900 mb-1">Soutenez cette librairie</h3>
            <p className="text-sm text-emerald-700">
              30% de chaque achat effectue via cette librairie sera directement reverse a {bookstore.name}.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Informations</h2>
          <div className="space-y-3">
            {bookstore.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">{bookstore.phone}</span>
              </div>
            )}
            {bookstore.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-slate-400" />
                <a href={`mailto:${bookstore.email}`} className="text-emerald-800 hover:underline">
                  {bookstore.email}
                </a>
              </div>
            )}
            {bookstore.website && (
              <div className="flex items-center gap-3 text-sm">
                <Globe className="h-4 w-4 text-slate-400" />
                <a href={bookstore.website} target="_blank" rel="noopener noreferrer" className="text-emerald-800 hover:underline">
                  Site web
                </a>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">{bookstore.address}, {bookstore.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Books */}
      {books && books.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Livres recommandes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book as any} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
