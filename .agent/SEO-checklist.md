# SEO Optimization Checklist

Sử dụng checklist này để tối ưu hóa SEO cho các trang trong ứng dụng.

## ✅ Trang đã hoàn thành

### Trang chủ (`app/page.tsx`)

- [x] Chuyển đổi từ Client Component sang Server Component
- [x] Thêm metadata đầy đủ (title, description, keywords, OpenGraph)
- [x] Server-side data fetching
- [x] Loại bỏ loading states không cần thiết
- [x] Semantic HTML với h1, h2 tags

### Root Layout (`app/layout.tsx`)

- [x] Enhanced metadata với title template
- [x] Keywords đầy đủ
- [x] OpenGraph tags (locale, siteName, etc.)
- [x] Twitter Card metadata
- [x] Robots meta tags cho Google Bot
- [x] Authors metadata

## 🔄 Trang cần tối ưu

### Priority 1: Public Pages (High SEO value)

#### `/movies` - Danh sách phim

- [ ] Kiểm tra xem có đang dùng "use client" không
- [ ] Chuyển sang Server Component nếu có thể
- [ ] Thêm unique metadata:
  ```tsx
  export const metadata: Metadata = {
    title: "Danh sách phim",
    description: "Khám phá toàn bộ bộ sưu tập phim đang chiếu và sắp chiếu...",
    keywords: ["danh sách phim", "phim mới", "all movies"],
  };
  ```
- [ ] Server-side pagination nếu cần
- [ ] Schema.org markup cho movie list

#### `/movie/[id]` - Chi tiết phim (Dynamic Route)

- [ ] Generate static params cho các phim phổ biến
- [ ] Dynamic metadata từ movie data:
  ```tsx
  export async function generateMetadata({ params }): Promise<Metadata> {
    const movie = await movieService.getWithDetails(params.id);
    return {
      title: movie.name,
      description: movie.synopsis,
      openGraph: {
        images: [movie.image],
      },
    };
  }
  ```
- [ ] Schema.org Movie markup
- [ ] Breadcrumbs
- [ ] Canonical URL

#### `/cinemas` - Danh sách rạp

- [ ] Server Component conversion
- [ ] Location-based metadata
- [ ] Schema.org MovieTheater markup
- [ ] Local business structured data

#### `/cinemas/[id]` - Chi tiết rạp

- [ ] Dynamic metadata với cinema info
- [ ] Schema.org MovieTheater với address
- [ ] Reviews schema nếu có
- [ ] Opening hours markup

#### `/promotions` - Trang khuyến mãi

- [ ] Server Component
- [ ] Metadata với offer keywords
- [ ] Schema.org Offer markup
- [ ] Valid from/to dates trong structured data

### Priority 2: Protected Pages (Lower SEO priority)

#### `/book-ticket/[id]` - Đặt vé

- [ ] noindex, nofollow (không cần SEO cho booking flow)
- [ ] Minimal metadata
- [ ] Focus on UX, không phải SEO

#### `/profile` - Trang cá nhân

- [ ] noindex, nofollow
- [ ] Protected route, không cần SEO

#### `/admin/*` - Admin pages

- [ ] noindex, nofollow
- [ ] robots.txt block

### Priority 3: Auth Pages

#### `/login`, `/register`

- [ ] Basic metadata
- [ ] noindex recommended (tránh duplicate content)

## 🛠️ Cách áp dụng cho mỗi trang

### Bước 1: Phân tích trang hiện tại

```bash
# Kiểm tra file xem có "use client" không
grep -r "use client" app/
```

### Bước 2: Quyết định chiến lược

- **Có thể chuyển Server Component?**
  - ✅ Yes: Nếu không cần useState, useEffect, onClick handlers ở root
  - ❌ No: Giữ Client Component, tối ưu metadata và structured data

### Bước 3: Implement Server Component (nếu có thể)

```tsx
// Trước
"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/api/data")
      .then((r) => r.json())
      .then(setData);
  }, []);
  // ...
}

// Sau
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "...",
  description: "...",
};

export default async function Page() {
  const data = await fetch("/api/data").then((r) => r.json());
  // ...
}
```

### Bước 4: Thêm Metadata

```tsx
export const metadata: Metadata = {
  title: "Unique page title",
  description: "Compelling description 150-160 chars",
  keywords: ["relevant", "keywords"],
  openGraph: {
    title: "OG title",
    description: "OG description",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
};
```

### Bước 5: Dynamic Metadata (cho [id] pages)

```tsx
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const item = await fetchData(params.id);

  return {
    title: item.name,
    description: item.description,
    openGraph: {
      title: item.name,
      description: item.description,
      images: [item.image],
    },
  };
}
```

### Bước 6: Structured Data (Schema.org)

```tsx
export default async function MoviePage({ params }) {
  const movie = await movieService.getWithDetails(params.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.name,
    image: movie.image,
    datePublished: movie.release_date,
    director: {
      "@type": "Person",
      name: movie.directors.join(", "),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: movie.avg_rating,
      ratingCount: movie.total_reviews,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page content */}
    </>
  );
}
```

## 📊 Testing SEO

### Tools để kiểm tra

1. **Google Search Console** - Submit sitemap, check indexing
2. **Lighthouse** - SEO audit score
3. **Meta Tags Checker** - https://metatags.io/
4. **Rich Results Test** - https://search.google.com/test/rich-results
5. **PageSpeed Insights** - Performance + SEO

### Checklist cho mỗi page

- [ ] Title < 60 chars
- [ ] Description 150-160 chars
- [ ] H1 tag (only one per page)
- [ ] H2, H3 hierarchy đúng
- [ ] Images có alt text
- [ ] Internal links
- [ ] Mobile responsive
- [ ] Fast loading (LCP < 2.5s)
- [ ] No console errors
- [ ] Valid HTML
- [ ] HTTPS
- [ ] Canonical URL
- [ ] robots.txt configured
- [ ] sitemap.xml generated

## 🎯 Next Steps

1. **Tạo sitemap**

   ```tsx
   // app/sitemap.ts
   export default async function sitemap() {
     const movies = await movieService.getAll();

     return [
       { url: "https://cinemahub.com", lastModified: new Date() },
       { url: "https://cinemahub.com/movies", lastModified: new Date() },
       ...movies.map((m) => ({
         url: `https://cinemahub.com/movie/${m.movie_id}`,
         lastModified: new Date(m.updated_at),
       })),
     ];
   }
   ```

2. **Tạo robots.txt**

   ```tsx
   // app/robots.ts
   export default function robots() {
     return {
       rules: {
         userAgent: "*",
         allow: "/",
         disallow: ["/admin", "/api", "/book-ticket"],
       },
       sitemap: "https://cinemahub.com/sitemap.xml",
     };
   }
   ```

3. **Performance optimization**

   - Image optimization (next/image)
   - Font optimization (next/font)
   - Code splitting
   - Lazy loading

4. **Analytics**
   - Google Analytics 4
   - Meta Pixel (nếu cần)
   - Conversion tracking

## 📚 Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Movie](https://schema.org/Movie)
- [Google Search Central](https://developers.google.com/search)
- [Web Vitals](https://web.dev/vitals/)
