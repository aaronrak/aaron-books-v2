const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://qimfcdpldiljzxwkvqvk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWZjZHBsZGlsanp4d2t2cXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMTEwMDcsImV4cCI6MjA5NzY4NzAwN30.cd6eCtOGnVC_-Dx7Piq89bas-Ocj1WH8in6PN6amgHs'
);

const authors = [
  { id: 'a1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a', name: 'Victor Hugo', bio: 'Ecrivain francais de renommee mondiale', photo_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&h=200&fit=crop' },
  { id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', name: 'Emile Zola', bio: 'Chef de file du naturalisme francais', photo_url: 'https://images.unsplash.com/photo-1471107340928-a1876714b8f3?w=200&h=200&fit=crop' },
  { id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', name: 'Marcel Proust', bio: 'Auteur de A la recherche du temps perdu', photo_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop' },
  { id: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', name: 'Albert Camus', bio: 'Philosophe et ecrivain francais', photo_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=200&fit=crop' },
  { id: 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', name: 'Simone de Beauvoir', bio: 'Philosophe et feministe francaise', photo_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop' },
];

const categories = [
  { id: 'c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', name: 'Romans', slug: 'romans', description: 'Romans classiques et contemporains' },
  { id: 'c2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d', name: 'Science-Fiction', slug: 'science-fiction', description: 'Aventures futures et mondes imaginaires' },
  { id: 'c3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e', name: 'Histoire', slug: 'histoire', description: 'Revolutions, guerres et civilisations' },
  { id: 'c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f', name: 'Philosophie', slug: 'philosophie', description: 'Pensees, existences et grandes questions' },
  { id: 'c5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a', name: 'Classiques', slug: 'classiques', description: 'Oeuvres intemporelles' },
  { id: 'c6f7a8b9-c0d1-2e3f-4a5b-6c7d8e9f0a1b', name: 'Nouveautes', slug: 'nouveautes', description: 'Dernieres sorties' },
];

const books = [
  { id: 'b1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', title: 'Les Miserables', subtitle: 'Tome 1', isbn: '978-2-07-040922-8', description: 'Le roman monumental de Victor Hugo qui suit la vie de Jean Valjean', cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop', publisher: 'Gallimard', publication_date: '1862-03-01', price: 14.90, original_price: 18.90, format: 'paperback', language: 'fr', page_count: 1200, in_stock: true, author_id: 'a1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a', rating: 4.8, review_count: 1243 },
  { id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', title: 'L Etranger', isbn: '978-2-07-036002-4', description: 'Meursault, un employe d Alger', cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop', publisher: 'Gallimard', publication_date: '1942-05-19', price: 9.90, original_price: 12.90, format: 'paperback', language: 'fr', page_count: 185, in_stock: true, author_id: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', rating: 4.7, review_count: 892 },
  { id: 'b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e', title: 'Germinal', subtitle: 'Les Rougon-Macquart', isbn: '978-2-253-00101-2', description: 'Un roman sur la greve des mineurs', cover_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', publisher: 'Le Livre de Poche', publication_date: '1885-03-01', price: 11.50, original_price: 14.50, format: 'paperback', language: 'fr', page_count: 528, in_stock: true, author_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', rating: 4.6, review_count: 567 },
  { id: 'b4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f', title: 'Du cote de chez Swann', subtitle: 'A la recherche du temps perdu', isbn: '978-2-07-011282-1', description: 'Premier volume de la grande oeuvre de Marcel Proust', cover_image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop', publisher: 'Gallimard', publication_date: '1913-11-01', price: 13.90, original_price: 16.90, format: 'hardcover', language: 'fr', page_count: 512, in_stock: true, author_id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', rating: 4.9, review_count: 423 },
  { id: 'b5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a', title: 'Le Deuxieme Sexe', subtitle: 'Tome 1 : Les faits et les mythes', isbn: '978-2-07-032351-7', description: 'L ouvrage fondateur de la pensee feministe', cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop', publisher: 'Gallimard', publication_date: '1949-06-01', price: 15.90, original_price: 19.90, format: 'paperback', language: 'fr', page_count: 432, in_stock: true, author_id: 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', rating: 4.8, review_count: 678 },
  { id: 'b6f7a8b9-c0d1-2e3f-4a5b-6c7d8e9f0a1b', title: 'Notre-Dame de Paris', subtitle: '1482', isbn: '978-2-07-040923-5', description: 'L histoire tragique de la belle Esmeralda', cover_image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop', publisher: 'Gallimard', publication_date: '1831-03-16', price: 12.90, original_price: 15.90, format: 'paperback', language: 'fr', page_count: 648, in_stock: true, author_id: 'a1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a', rating: 4.5, review_count: 789 },
  { id: 'b7a8b9c0-d1e2-3f4a-5b6c-7d8e9f0a1b2c', title: 'La Peste', isbn: '978-2-07-036003-1', description: 'Oran est frappee par la peste', cover_image: 'https://images.unsplash.com/photo-1519682577862-22b62b24e491?w=400&h=600&fit=crop', publisher: 'Gallimard', publication_date: '1947-06-01', price: 10.90, original_price: 13.90, format: 'ebook', language: 'fr', page_count: 320, in_stock: true, author_id: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', rating: 4.6, review_count: 345 },
  { id: 'b8b9c0d1-e2f3-4a5b-6c7d-8e9f0a1b2c3d', title: 'Nana', subtitle: 'Les Rougon-Macquart', isbn: '978-2-253-00102-9', description: 'L ascension fulgurante d une prostituee', cover_image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop', publisher: 'Le Livre de Poche', publication_date: '1880-02-01', price: 9.50, original_price: 11.90, format: 'paperback', language: 'fr', page_count: 448, in_stock: true, author_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', rating: 4.3, review_count: 234 },
  { id: 'b9c0d1e2-f3a4-5b6c-7d8e-9f0a1b2c3d4e', title: 'Sodome et Gomorrhe', subtitle: 'A la recherche du temps perdu', isbn: '978-2-07-011283-8', description: 'Quatrieme volume de la Recherche', cover_image: 'https://images.unsplash.com/photo-1521123845560-14093637d4d2?w=400&h=600&fit=crop', publisher: 'Gallimard', publication_date: '1921-01-01', price: 14.50, original_price: 17.90, format: 'hardcover', language: 'fr', page_count: 640, in_stock: true, author_id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', rating: 4.7, review_count: 312 },
  { id: 'b0c1d2e3-f4a5-6b7c-8d9e-0f1a2b3c4d5e', title: 'Tous les hommes sont mortels', isbn: '978-2-07-036004-8', description: 'Fosca, un homme immortel, raconte sa vie', cover_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop', publisher: 'Gallimard', publication_date: '1946-09-01', price: 11.90, original_price: 14.90, format: 'paperback', language: 'fr', page_count: 384, in_stock: true, author_id: 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', rating: 4.4, review_count: 198 },
  { id: 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e', title: 'L Assommoir', subtitle: 'Les Rougon-Macquart', isbn: '978-2-253-00103-6', description: 'Le roman de la misere ouvriere', cover_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop', publisher: 'Le Livre de Poche', publication_date: '1877-01-01', price: 10.90, original_price: 13.50, format: 'paperback', language: 'fr', page_count: 560, in_stock: true, author_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', rating: 4.6, review_count: 445 },
  { id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7f', title: 'Les Femmes qui lisent sont dangereuses', isbn: '978-2-08-025620-4', description: 'Un essai illustre celebrant la place des femmes lectrices', cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop', publisher: 'Flammarion', publication_date: '2023-10-01', price: 24.90, original_price: 29.90, format: 'hardcover', language: 'fr', page_count: 192, in_stock: true, author_id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', rating: 4.5, review_count: 156 },
];

const bookstores = [
  { id: '625e094f-1acb-4ea4-af4f-c95ae8ffda57', name: 'Librairie des Ecrivains', slug: 'librairie-des-ecrivains', bio: 'Librairie independante fondee en 1987 au coeur de Saint-Germain-des-Pres', address: '21 Rue de l Odeon', city: 'Paris', country: 'France', latitude: 48.8490, longitude: 2.3380, website: 'https://librairie-ecrivains.fr', email: 'contact@librairie-ecrivains.fr', phone: '01 43 25 44 90', logo_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=200&h=200&fit=crop', cover_image: 'https://images.unsplash.com/photo-1507842217121-9e9f8b3607c3?w=800&h=400&fit=crop', commission_rate: 30.00, featured: true, is_active: true },
  { id: '0a9dc2f9-8e96-485b-ad13-63e79ed4c720', name: 'La Parenthese Enchantee', slug: 'la-parenthese-enchantee', bio: 'Librairie jeunesse et jeune adulte de Lyon', address: '45 Rue de la Republique', city: 'Lyon', country: 'France', latitude: 45.7640, longitude: 4.8357, website: 'https://parenthese-enchantee.fr', email: 'bonjour@parenthese-enchantee.fr', phone: '04 78 42 30 15', logo_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop', cover_image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=400&fit=crop', commission_rate: 30.00, featured: true, is_active: true },
  { id: '90f24165-2643-4961-af5d-0aa24140d2b7', name: 'Le Comptoir des Pages', slug: 'le-comptoir-des-pages', bio: 'Librairie generaliste a Bordeaux', address: '12 Cours de l Intendance', city: 'Bordeaux', country: 'France', latitude: 44.8378, longitude: -0.5792, website: 'https://comptoir-des-pages.fr', email: 'infos@comptoir-des-pages.fr', phone: '05 56 44 22 33', logo_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop', cover_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop', commission_rate: 30.00, featured: false, is_active: true },
];

const bookCategories = [
  { book_id: 'b1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', category_id: 'c5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a' },
  { book_id: 'b1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', category_id: 'c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c' },
  { book_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', category_id: 'c5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a' },
  { book_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', category_id: 'c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f' },
  { book_id: 'b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e', category_id: 'c5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a' },
  { book_id: 'b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e', category_id: 'c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c' },
  { book_id: 'b4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f', category_id: 'c5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a' },
  { book_id: 'b4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f', category_id: 'c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c' },
  { book_id: 'b5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a', category_id: 'c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f' },
  { book_id: 'b6f7a8b9-c0d1-2e3f-4a5b-6c7d8e9f0a1b', category_id: 'c5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a' },
  { book_id: 'b7a8b9c0-d1e2-3f4a-5b6c-7d8e9f0a1b2c', category_id: 'c5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a' },
  { book_id: 'b8b9c0d1-e2f3-4a5b-6c7d-8e9f0a1b2c3d', category_id: 'c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c' },
  { book_id: 'b9c0d1e2-f3a4-5b6c-7d8e-9f0a1b2c3d4e', category_id: 'c5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a' },
  { book_id: 'b0c1d2e3-f4a5-6b7c-8d9e-0f1a2b3c4d5e', category_id: 'c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f' },
  { book_id: 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e', category_id: 'c5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a' },
  { book_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7f', category_id: 'c6f7a8b9-c0d1-2e3f-4a5b-6c7d8e9f0a1b' },
];

const featuredLists = [
  { id: 'b91d8019-4bd9-4b5c-94bb-e877513b1684', title: 'Nos Coups de Coeur', slug: 'coup-de-coeur', description: 'Les livres preferes de nos librairies partenaires', position: 1, is_active: true },
  { id: '394dce01-2682-48a4-89d8-2eea5d45e503', title: 'Nouveautes 2024', slug: 'nouveautes-2024', description: 'Les dernieres parutions a ne pas manquer', position: 2, is_active: true },
];

const featuredListBooks = [
  { list_id: 'b91d8019-4bd9-4b5c-94bb-e877513b1684', book_id: 'b1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', position: 1 },
  { list_id: 'b91d8019-4bd9-4b5c-94bb-e877513b1684', book_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', position: 2 },
  { list_id: 'b91d8019-4bd9-4b5c-94bb-e877513b1684', book_id: 'b5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a', position: 3 },
  { list_id: 'b91d8019-4bd9-4b5c-94bb-e877513b1684', book_id: 'b4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f', position: 4 },
  { list_id: '394dce01-2682-48a4-89d8-2eea5d45e503', book_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7f', position: 1 },
  { list_id: '394dce01-2682-48a4-89d8-2eea5d45e503', book_id: 'b7a8b9c0-d1e2-3f4a-5b6c-7d8e9f0a1b2c', position: 2 },
  { list_id: '394dce01-2682-48a4-89d8-2eea5d45e503', book_id: 'b9c0d1e2-f3a4-5b6c-7d8e-9f0a1b2c3d4e', position: 3 },
  { list_id: '394dce01-2682-48a4-89d8-2eea5d45e503', book_id: 'b0c1d2e3-f4a5-6b7c-8d9e-0f1a2b3c4d5e', position: 4 },
];

const reviews = [
  { id: 'r1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', book_id: 'b1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', reviewer_name: 'Marie L.', rating: 5, comment: 'Une oeuvre monumentale, un chef-d oeuvre de la litterature francaise. Jean Valjean est un personnage inoubliable.' },
  { id: 'r2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', book_id: 'b1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', reviewer_name: 'Jean-Pierre D.', rating: 4, comment: 'Long mais absolument captivant. La description des barricades est epique.' },
  { id: 'r3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', book_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', reviewer_name: 'Sophie M.', rating: 5, comment: 'Camus a son meilleur. L absurde resume en 200 pages. Phenomenal.' },
  { id: 'r4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8a9b', book_id: 'b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e', reviewer_name: 'Lucas B.', rating: 5, comment: 'Germinal est une claque. Zola nous plonge dans la mine avec une intensite rare.' },
  { id: 'r5a6b7c8-d9e0-1f2a-3b4c-5d6e7f8a9b0c', book_id: 'b5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a', reviewer_name: 'Anais R.', rating: 5, comment: 'Un livre fondateur, essentiel. De Beauvoir a ouvert les yeux sur des siecles d oppression.' },
];

async function seed() {
  console.log('Seeding database...');
  
  const tables = [
    { name: 'reviews', data: reviews },
    { name: 'featured_list_books', data: featuredListBooks },
    { name: 'featured_lists', data: featuredLists },
    { name: 'book_categories', data: bookCategories },
    { name: 'bookstores', data: bookstores },
    { name: 'books', data: books },
    { name: 'categories', data: categories },
    { name: 'authors', data: authors },
  ];
  
  for (const { name, data } of tables) {
    const { error, count } = await supabase.from(name).upsert(data, { onConflict: 'id' });
    if (error) {
      console.error(`Error seeding ${name}:`, error.message);
    } else {
      console.log(`Seeded ${name}: ${data.length} rows`);
    }
  }
  
  console.log('Done!');
}

seed().catch(console.error);
