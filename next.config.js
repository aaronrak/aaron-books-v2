/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qimfcdpldiljzxwkvqvk.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWZjZHBsZGlsanp4d2t2cXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMTEwMDcsImV4cCI6MjA5NzY4NzAwN30.cd6eCtOGnVC_-Dx7Piq89bas-Ocj1WH8in6PN6amgHs',
  },
};

module.exports = nextConfig;
