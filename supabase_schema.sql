-- НОВА.мн Supabase Schema
-- Run this in your Supabase SQL editor

-- Categories
create table if not exists categories (
  id serial primary key,
  name text not null,
  slug text not null unique,
  color text default '#C8202A',
  created_at timestamptz default now()
);

insert into categories (name, slug) values
  ('Улс төр', 'politics'),
  ('Эдийн засаг', 'economy'),
  ('Нийгэм', 'society'),
  ('Спорт', 'sport'),
  ('Технологи', 'technology')
on conflict do nothing;

-- Articles
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  body text,
  category_id int references categories(id),
  author text default 'НОВА.мн',
  image_url text,
  is_featured boolean default false,
  is_breaking boolean default false,
  views int default 0,
  read_minutes int default 3,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Increment views function
create or replace function increment_views(article_id uuid)
returns void as $$
  update articles set views = views + 1 where id = article_id;
$$ language sql;

-- Breaking news ticker
create table if not exists breaking_news (
  id serial primary key,
  text text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- RLS Policies (public read, auth write)
alter table articles enable row level security;
alter table categories enable row level security;
alter table breaking_news enable row level security;

create policy "Public read articles" on articles for select using (true);
create policy "Public read categories" on categories for select using (true);
create policy "Public read breaking" on breaking_news for select using (true);
create policy "Auth write articles" on articles for insert with check (auth.role() = 'authenticated');
create policy "Auth update articles" on articles for update using (auth.role() = 'authenticated');
