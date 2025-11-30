# CinemaHub Optimization Plan

## Mục tiêu

Tối ưu hóa toàn diện dự án CinemaHub về performance, SEO, bundle size, và chuẩn bị cho production deployment.

---

## 1. Next.js Configuration Optimization

**Priority: HIGH** | **Time: 30 mins**

### Issues

- Thiếu bundle analyzer
- Không có compression configuration
- Missing output mode optimization
- Thiếu compiler options

### Recommended Changes

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance Optimizations
  output: "standalone", // For Docker/Vercel deployment
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Security - hide Next.js header

  // Compiler Options
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // Image Optimization
  images: {
    formats: ["image/avif", "image/webp"], // Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    remotePatterns: [
      { protocol: "https", hostname: "avatar.vercel.sh" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },

  // Bundle Analyzer (development only)
  ...(process.env.ANALYZE === "true" && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
          })
        );
      }
      return config;
    },
  }),

  // Experimental features
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
};

export default nextConfig;
```

**Install dependencies:**

```bash
npm install -D webpack-bundle-analyzer
```

**Add script to package.json:**

```json
"analyze": "ANALYZE=true next build"
```

---

## 2. Image Optimization

**Priority: MEDIUM** | **Time: 45 mins**

### Current Issues

- No blur placeholders for images
- No lazy loading indicators
- Missing responsive images in some components

### Recommended Changes

#### A. Add blur data URLs

Create utility to generate blur placeholders:

```typescript
// lib/image-utils.ts
export function getBlurDataURL(width = 10, height = 10): string {
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#333" offset="20%" />
          <stop stop-color="#222" offset="50%" />
          <stop stop-color="#333" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#333" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `;

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;
}
```

#### B. Update Image components

Add `placeholder="blur"` and `blurDataURL` to all `<Image>` components.

Example:

```tsx
import Image from "next/image";
import { getBlurDataURL } from "@/lib/image-utils";

<Image
  src={movie.poster_url}
  alt={movie.title}
  width={300}
  height={450}
  placeholder="blur"
  blurDataURL={getBlurDataURL(300, 450)}
/>;
```

---

## 3. Performance Optimization

**Priority: HIGH** | **Time: 1 hour**

### A. Implement ISR (Incremental Static Regeneration)

For pages with relatively static content:

```typescript
// app/page.tsx
export const revalidate = 3600; // Revalidate every hour

// app/movie/[id]/page.tsx
export const revalidate = 1800; // Revalidate every 30 minutes

// app/cinemas/page.tsx
export const revalidate = 86400; // Revalidate every 24 hours

// app/events/page.tsx
export const revalidate = 3600; // Revalidate every hour
```

### B. Add Loading States

Create proper loading.tsx for each route:

```tsx
// app/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
}

// app/movie/[id]/loading.tsx
export default function MovieLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="animate-pulse space-y-8">
        <div className="h-96 bg-muted rounded-3xl" />
        <div className="h-8 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
      </div>
    </div>
  );
}
```

### C. Implement Streaming with Suspense

Use `<Suspense>` for large data sections:

```tsx
// app/page.tsx
import { Suspense } from "react";

function MovieTabsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] bg-muted rounded-2xl" />
        </div>
      ))}
    </div>
  );
}

<Suspense fallback={<MovieTabsSkeleton />}>
  <MovieTabs
    nowShowingMovies={nowShowingMovies}
    comingSoonMovies={comingSoonMovies}
  />
</Suspense>;
```

### D. Add Caching Headers to API Routes

```typescript
// app/api/movies/route.ts
export async function GET() {
  const movies = await movieService.getAllWithDetails();

  return Response.json(movies, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

// app/api/showtimes/route.ts
export async function GET() {
  const showtimes = await showtimeService.getAll();

  return Response.json(showtimes, {
    headers: {
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
```

---

## 4. Bundle Size Optimization

**Priority: MEDIUM** | **Time: 1 hour**

### A. Dynamic Imports

For heavy components (especially admin):

```typescript
// app/admin/dashboard/page.tsx
import dynamic from "next/dynamic";

const AdminDashboard = dynamic(() => import("@/components/admin-dashboard"), {
  loading: () => <div>Loading dashboard...</div>,
  ssr: false, // If client-side only
});

// For charts/heavy visualizations
const RevenueChart = dynamic(() => import("@/components/revenue-chart"), {
  loading: () => <div className="h-64 bg-muted animate-pulse rounded-xl" />,
});
```

### B. Tree-shaking optimization

Check all icon imports are optimized:

```typescript
// ❌ Bad - imports entire library
import * as Icons from "lucide-react";

// ✅ Good - tree-shakable
import { Film, User, Settings, Calendar, MapPin } from "lucide-react";
```

Audit all files for proper imports:

```bash
# Search for bad imports
grep -r "import \* as" app/ components/
```

### C. Minimize third-party libraries

Review `package.json` for:

- Unused dependencies
- Duplicate functionality
- Heavy libraries that could be replaced

**Run bundle analyzer to find biggest packages:**

```bash
npm run analyze
```

---

## 5. SEO Optimization

**Priority: MEDIUM** | **Time: 1.5 hours**

### A. Add Structured Data (JSON-LD)

#### Movie Pages

```tsx
// app/movie/[id]/page.tsx
export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await movieService.getWithDetails(id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    image: movie.poster_url,
    description: movie.description,
    genre: movie.genre,
    datePublished: movie.release_date,
    duration: `PT${movie.duration}M`,
    actor: movie.cast?.split(", ").map((name) => ({
      "@type": "Person",
      name,
    })),
    director: {
      "@type": "Person",
      name: movie.director,
    },
    aggregateRating: movie.average_rating
      ? {
          "@type": "AggregateRating",
          ratingValue: movie.average_rating,
          reviewCount: movie.review_count || 0,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Rest of component */}
    </>
  );
}
```

#### Cinema Pages

```tsx
// app/cinemas/[id]/page.tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MovieTheater",
  name: cinema.name,
  address: {
    "@type": "PostalAddress",
    streetAddress: cinema.address,
    addressLocality: cinema.city,
    addressCountry: "VN",
  },
  telephone: cinema.phone_number,
};
```

#### Event Pages

```tsx
// app/events/[id]/page.tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: event.title,
  description: event.description,
  image: event.image_url,
  startDate: event.start_date,
  endDate: event.end_date,
  eventStatus: "https://schema.org/EventScheduled",
  organizer: {
    "@type": "Organization",
    name: "CinemaHub",
  },
};
```

### B. Add sitemap.xml

```typescript
// app/sitemap.ts
import { MetadataRoute } from "next";
import { movieService, cinemaService, eventService } from "@/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cinemahub.com";

  // Fetch all dynamic pages
  const [movies, cinemas, events] = await Promise.all([
    movieService.getAll(),
    cinemaService.getAll(),
    eventService.getAll(),
  ]);

  const moviePages = movies.map((movie) => ({
    url: `${baseUrl}/movie/${movie.movie_id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const cinemaPages = cinemas.map((cinema) => ({
    url: `${baseUrl}/cinemas/${cinema.cinema_id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const eventPages = events.map((event) => ({
    url: `${baseUrl}/events/${event.event_id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cinemas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/promotions`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...moviePages,
    ...cinemaPages,
    ...eventPages,
  ];
}
```

### C. Add robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/account/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/account/"],
      },
    ],
    sitemap: "https://cinemahub.com/sitemap.xml",
  };
}
```

---

## 6. Security Optimization

**Priority: MEDIUM** | **Time: 30 mins**

### Add Security Headers

```javascript
// next.config.mjs
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig = {
  // ... other config
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

---

## 7. Database Optimization (Preparation)

**Priority: LOW** | **Time: Planning only**

### Recommendations for Future Backend API

#### A. Index Optimization

Add indexes to frequently queried columns in `mysql_Ticket_Booking_System.sql`:

```sql
-- Showtimes filtering
CREATE INDEX idx_showtime_movie_date ON SHOWTIME(movie_id, show_date);
CREATE INDEX idx_showtime_cinema ON SHOWTIME(cinema_id, show_date);
CREATE INDEX idx_showtime_status ON SHOWTIME(status);

-- Seat availability
CREATE INDEX idx_seat_room ON SEAT(room_id);

-- Reviews
CREATE INDEX idx_review_movie ON REVIEW(movie_id, created_at DESC);

-- Tickets
CREATE INDEX idx_ticket_showtime ON TICKET(showtime_id);
CREATE INDEX idx_ticket_account ON TICKET(phone_number, created_at DESC);
```

#### B. Connection Pooling Strategy

```javascript
// For future MySQL connection
{
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
}
```

#### C. Caching Strategy

- **Redis**: For seat availability (TTL: 5 mins)
- **In-memory**: For movie list (TTL: 1 hour)
- **CDN**: For static images

#### D. Rate Limiting

```typescript
// For API routes
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
```

---

## Implementation Priority

### 🚀 Phase 1: Quick Wins (2-3 hours)

**Do this FIRST for immediate impact!**

- [ ] Update `next.config.mjs` with all optimizations
- [ ] Install `webpack-bundle-analyzer`
- [ ] Add `revalidate` to all pages
- [ ] Add security headers
- [ ] Create `app/robots.ts`
- [ ] Create `app/sitemap.ts`
- [ ] Add analyze script to `package.json`

**Files to modify:**

- `next.config.mjs`
- `package.json`
- `app/page.tsx`
- `app/movie/[id]/page.tsx`
- `app/cinemas/page.tsx`
- `app/events/page.tsx`
- Create `app/robots.ts` (new)
- Create `app/sitemap.ts` (new)

---

### 🎨 Phase 2: Performance (3-4 hours)

- [ ] Create `lib/image-utils.ts` with blur placeholder
- [ ] Update all `<Image>` components with blur placeholders
- [ ] Create loading.tsx for main routes
- [ ] Add Suspense boundaries in `app/page.tsx`
- [ ] Add cache headers to all API routes
- [ ] Run bundle analyzer and optimize

**Files to modify:**

- Create `lib/image-utils.ts` (new)
- All components using `<Image>`
- Create `app/loading.tsx` (new)
- Create `app/movie/[id]/loading.tsx` (new)
- All files in `app/api/`

---

### 🔍 Phase 3: SEO Enhancement (2-3 hours)

- [ ] Add JSON-LD to movie pages
- [ ] Add JSON-LD to cinema pages
- [ ] Add JSON-LD to event pages
- [ ] Enhance metadata for all pages
- [ ] Test structured data with Google Rich Results Test

**Files to modify:**

- `app/movie/[id]/page.tsx`
- `app/cinemas/[id]/page.tsx`
- `app/events/[id]/page.tsx`

---

### 📊 Phase 4: Future Planning

- [ ] Database query optimization
- [ ] Real API integration preparation
- [ ] Performance monitoring setup
  - Vercel Analytics (already installed)
  - Consider Sentry for error tracking
- [ ] Lighthouse CI integration

---

## Metrics to Track

### Before vs After Optimization

Use Lighthouse (Chrome DevTools) to measure:

#### Performance Metrics

- **Lighthouse Score**: Target 90+ on all metrics
- **LCP (Largest Contentful Paint)**: Target < 2.5s
- **FID (First Input Delay)**: Target < 100ms
- **CLS (Cumulative Layout Shift)**: Target < 0.1
- **TBT (Total Blocking Time)**: Target < 300ms
- **TTI (Time to Interactive)**: Target < 3.5s

#### Bundle Size

- **Main bundle**: Keep < 200KB (gzipped)
- **First Load JS**: Keep < 300KB
- **Unused JavaScript**: Reduce to < 10%

#### SEO Metrics

- **SEO Score**: Target 100
- **Accessibility Score**: Target 95+
- **Best Practices Score**: Target 100

### Tools for Testing

```bash
# Lighthouse CLI
npx lighthouse https://your-site.com --view

# Bundle Size Analysis
npm run analyze

# Manual Testing
npm run build
npm run start
```

---

## Checklist Summary

### ✅ Must Do (Phase 1)

- [ ] Next.js config optimization
- [ ] ISR revalidation
- [ ] Security headers
- [ ] robots.txt
- [ ] sitemap.xml

### 🎯 Should Do (Phase 2)

- [ ] Image blur placeholders
- [ ] Loading states
- [ ] Suspense boundaries
- [ ] API caching
- [ ] Bundle optimization

### 💎 Nice to Have (Phase 3)

- [ ] Structured data (JSON-LD)
- [ ] Enhanced metadata
- [ ] Schema markup

### 🔮 Future

- [ ] Database optimization
- [ ] Real API preparation
- [ ] Monitoring setup

---

## Expected Results

After completing all phases:

### Performance

- ⚡ **20-30% faster load times**
- 📱 **Improved mobile experience**
- 🎯 **Better Core Web Vitals**

### SEO

- 🔍 **Higher Google rankings**
- 📊 **Rich snippets in search results**
- 🌐 **Better crawlability**

### User Experience

- ✨ **Smoother interactions**
- 🖼️ **No content layout shift**
- 🏃 **Faster navigation**

### Cost

- 💰 **Reduced bandwidth costs**
- 🚀 **Smaller bundle = faster deployment**
- 💾 **Better caching = less server load**

---

## Notes

1. **Testing**: Test each phase on a separate branch before merging
2. **Monitoring**: Use Vercel Analytics to track improvements
3. **Documentation**: Update `GEMINI.md` after major changes
4. **Backup**: Ensure git commits before major refactors

**Start with Phase 1 for quick, high-impact wins!** 🚀
