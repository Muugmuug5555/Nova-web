# НОВА.мн — Мэдээний портал

React + Supabase + Vercel стек дээр баригдсан мэдээний портал.

---

## Технологи

- **React 18** — UI framework
- **Vite** — Build tool
- **Supabase** — Database + Auth
- **Vercel** — Deployment
- **CSS Modules** — Styling

---

## Суулгах заавар

### 1. Repo clone хийх
```bash
git clone https://github.com/your-username/nova-mn.git
cd nova-mn
npm install
```

### 2. Supabase тохируулах
1. [supabase.com](https://supabase.com) дээр project үүсгэх
2. SQL Editor-т `supabase_schema.sql` файлыг ажиллуулах
3. Project URL болон anon key-г хуулах

### 3. Environment variables
```bash
cp .env.example .env
```
`.env` файлд Supabase мэдээллээ оруулах:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

### 4. Local ажиллуулах
```bash
npm run dev
```
http://localhost:5173 дээр нээгдэнэ.

---

## Vercel-д deploy хийх

1. GitHub-т push хийх
2. [vercel.com](https://vercel.com) дээр нэвтрэх
3. "Import Project" → GitHub repo сонгох
4. Environment variables нэмэх:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy дарах

---

## Файлын бүтэц

```
nova-mn/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx       # Навигация, dark mode toggle
│   │   │   ├── Header.module.css
│   │   │   ├── Ticker.jsx       # Яаралтай мэдээний тасдаг мөр
│   │   │   ├── Ticker.module.css
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.module.css
│   │   ├── Home/
│   │   │   ├── HomePage.jsx     # Нүүр хуудас
│   │   │   └── HomePage.module.css
│   │   ├── Article/
│   │   │   ├── ArticlePage.jsx  # Мэдээний дэлгэрэнгүй хуудас
│   │   │   └── ArticlePage.module.css
│   │   └── shared/
│   │       ├── NewsCard.jsx     # Hero, list, default карт
│   │       └── NewsCard.module.css
│   ├── hooks/
│   │   └── useArticles.js       # Supabase data fetching
│   ├── lib/
│   │   ├── supabase.js          # Supabase client
│   │   └── ThemeContext.jsx     # Dark/Light mode
│   ├── App.jsx                  # Main app + routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles + CSS variables
├── supabase_schema.sql          # Database schema
├── .env.example
├── package.json
├── vite.config.js
└── index.html
```

---

## Мэдээ оруулах

Supabase dashboard → Table Editor → `articles` хүснэгтэд шууд оруулах боломжтой.

Эсвэл Supabase-ийн API ашиглаж Make.com-оос автоматаар оруулах.

---

## Facebook Graph API sync (Make.com)

1. Make.com дээр шинэ scenario үүсгэх
2. Facebook Pages trigger → HTTP module → Supabase REST API
3. Supabase endpoint: `POST https://xxxx.supabase.co/rest/v1/articles`
4. Headers:
   - `apikey: your-anon-key`
   - `Authorization: Bearer your-anon-key`
   - `Content-Type: application/json`
