import { supabase } from "@/lib/supabase";
import { BookstoreCard } from "@/components/bookstore-card";
import { MapPin, Search } from "lucide-react";

export default async function BookstoresPage() {
  const { data: bookstores } = await supabase
    .from("bookstores")
    .select("*")
    .eq("is_active", true)
    .order("featured", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-5 w-5 text-emerald-800" />
        <h1 className="text-2xl font-bold text-slate-900">Librairies Partenaires</h1>
      </div>
      <p className="text-slate-600 mb-8 max-w-2xl">
        Choisissez une librairie a soutenir. 30% de chaque achat sera directement reverse a la librairie selectionnee.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookstores?.map((bookstore) => (
          <BookstoreCard key={bookstore.id} bookstore={bookstore} />
        ))}
      </div>
    </div>
  );
}
