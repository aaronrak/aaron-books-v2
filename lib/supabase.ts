import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Book = {
  id: string;
  title: string;
  subtitle: string | null;
  isbn: string | null;
  description: string | null;
  cover_image: string | null;
  publisher: string | null;
  publication_date: string | null;
  price: number;
  original_price: number | null;
  format: string;
  language: string | null;
  page_count: number | null;
  in_stock: boolean;
  author_id: string | null;
  rating: number | null;
  review_count: number | null;
  created_at: string;
  author?: Author;
  categories?: Category[];
};

export type Author = {
  id: string;
  name: string;
  bio: string | null;
  photo_url: string | null;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  created_at: string;
};

export type Bookstore = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  logo_url: string | null;
  cover_image: string | null;
  commission_rate: number;
  is_active: boolean;
  featured: boolean;
  created_at: string;
};

export type CartItem = {
  id: string;
  session_id: string;
  book_id: string;
  quantity: number;
  bookstore_id: string | null;
  created_at: string;
  updated_at: string;
  book?: Book;
  bookstore?: Bookstore;
};

export type Review = {
  id: string;
  book_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type FeaturedList = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  bookstore_id: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  books?: Book[];
};
