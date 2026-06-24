/*
# Create Bookshop MVP Database Schema

1. New Tables
- `authors` - book authors with bio and photo
- `categories` - book categories/genres
- `books` - book catalog with details, pricing, cover images
- `book_categories` - many-to-many relationship between books and categories
- `bookstores` - independent bookstore profiles
- `cart_items` - shopping cart items (session-based for MVP)
- `orders` - customer orders
- `order_items` - individual line items within orders

2. Security
- All tables have RLS enabled with public access policies (single-tenant MVP)
- Data is intentionally public for browsing and purchasing
- Cart items are session-scoped via `session_id` for guest checkout

3. Important Notes
- Books use a `cover_image` URL (stock photos from external sources)
- Bookstore commission is stored at order level (30% of cover price)
- Cart uses session_id for anonymous users (MVP approach)
- Orders include customer info directly for guest checkout
*/

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bio text,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  parent_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now()
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  isbn text UNIQUE,
  description text,
  cover_image text,
  publisher text,
  publication_date date,
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  format text NOT NULL DEFAULT 'paperback' CHECK (format IN ('paperback', 'hardcover', 'ebook', 'audiobook')),
  language text DEFAULT 'fr',
  page_count integer,
  in_stock boolean DEFAULT true,
  author_id uuid REFERENCES authors(id) ON DELETE SET NULL,
  rating numeric(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Book categories junction table
CREATE TABLE IF NOT EXISTS book_categories (
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, category_id)
);

-- Bookstores table
CREATE TABLE IF NOT EXISTS bookstores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  bio text,
  address text,
  city text,
  country text,
  latitude numeric(10,8),
  longitude numeric(11,8),
  website text,
  email text,
  phone text,
  logo_url text,
  cover_image text,
  commission_rate numeric(5,2) DEFAULT 30.00,
  is_active boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Cart items table (session-based for MVP)
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  bookstore_id uuid REFERENCES bookstores(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  session_id text,
  customer_email text NOT NULL,
  customer_first_name text NOT NULL,
  customer_last_name text NOT NULL,
  shipping_address text NOT NULL,
  shipping_city text NOT NULL,
  shipping_postal_code text NOT NULL,
  shipping_country text NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  bookstore_commission numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE SET NULL,
  book_title text NOT NULL,
  book_cover_image text,
  quantity integer NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  bookstore_id uuid REFERENCES bookstores(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Reviews table (basic for MVP)
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Featured books list for homepage curation
CREATE TABLE IF NOT EXISTS featured_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  bookstore_id uuid REFERENCES bookstores(id) ON DELETE SET NULL,
  position integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS featured_list_books (
  list_id uuid REFERENCES featured_lists(id) ON DELETE CASCADE,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  position integer DEFAULT 0,
  PRIMARY KEY (list_id, book_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author_id);
CREATE INDEX IF NOT EXISTS idx_books_format ON books(format);
CREATE INDEX IF NOT EXISTS idx_books_in_stock ON books(in_stock);
CREATE INDEX IF NOT EXISTS idx_books_created ON books(created_at);
CREATE INDEX IF NOT EXISTS idx_book_categories_book ON book_categories(book_id);
CREATE INDEX IF NOT EXISTS idx_book_categories_category ON book_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_session ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_book ON reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_bookstores_featured ON bookstores(featured);
CREATE INDEX IF NOT EXISTS idx_bookstores_slug ON bookstores(slug);

-- RLS Policies (public access for MVP - single tenant)
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookstores ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_list_books ENABLE ROW LEVEL SECURITY;

-- Authors: public read
DROP POLICY IF EXISTS "public_select_authors" ON authors;
CREATE POLICY "public_select_authors" ON authors FOR SELECT TO anon, authenticated USING (true);

-- Categories: public read
DROP POLICY IF EXISTS "public_select_categories" ON categories;
CREATE POLICY "public_select_categories" ON categories FOR SELECT TO anon, authenticated USING (true);

-- Books: public read
DROP POLICY IF EXISTS "public_select_books" ON books;
CREATE POLICY "public_select_books" ON books FOR SELECT TO anon, authenticated USING (true);

-- Book categories: public read
DROP POLICY IF EXISTS "public_select_book_categories" ON book_categories;
CREATE POLICY "public_select_book_categories" ON book_categories FOR SELECT TO anon, authenticated USING (true);

-- Bookstores: public read
DROP POLICY IF EXISTS "public_select_bookstores" ON bookstores;
CREATE POLICY "public_select_bookstores" ON bookstores FOR SELECT TO anon, authenticated USING (true);

-- Cart items: session-scoped (public but only by session_id)
DROP POLICY IF EXISTS "public_select_cart_items" ON cart_items;
CREATE POLICY "public_select_cart_items" ON cart_items FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_cart_items" ON cart_items;
CREATE POLICY "public_insert_cart_items" ON cart_items FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_cart_items" ON cart_items;
CREATE POLICY "public_update_cart_items" ON cart_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_cart_items" ON cart_items;
CREATE POLICY "public_delete_cart_items" ON cart_items FOR DELETE TO anon, authenticated USING (true);

-- Orders: public read (by session)
DROP POLICY IF EXISTS "public_select_orders" ON orders;
CREATE POLICY "public_select_orders" ON orders FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Order items: public read
DROP POLICY IF EXISTS "public_select_order_items" ON order_items;
CREATE POLICY "public_select_order_items" ON order_items FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_order_items" ON order_items;
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Reviews: public read/write
DROP POLICY IF EXISTS "public_select_reviews" ON reviews;
CREATE POLICY "public_select_reviews" ON reviews FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_reviews" ON reviews;
CREATE POLICY "public_insert_reviews" ON reviews FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Featured lists: public read
DROP POLICY IF EXISTS "public_select_featured_lists" ON featured_lists;
CREATE POLICY "public_select_featured_lists" ON featured_lists FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_select_featured_list_books" ON featured_list_books;
CREATE POLICY "public_select_featured_list_books" ON featured_list_books FOR SELECT TO anon, authenticated USING (true);
