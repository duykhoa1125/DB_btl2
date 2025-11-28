# Tối ưu hóa SEO cho Trang chủ

## Ngày: 2025-11-27

## Vấn đề ban đầu

Trang `app/page.tsx` đang sử dụng `"use client"` directive, khiến toàn bộ trang trở thành Client Component. Điều này ảnh hưởng đến SEO vì:

1. **Nội dung không được render sẵn trên server** - Search engines nhận được HTML rỗng ban đầu
2. **JavaScript phải chạy trước** - Người dùng và search engines phải đợi JS load và execute
3. **Thiếu metadata** - Không có title, description tối ưu cho từng trang
4. **Loading state không tốt cho SEO** - Nội dung hiển thị sau khi load xong

## Giải pháp đã áp dụng

### ✅ 1. Chuyển đổi sang Server Component

- **Xóa `"use client"` directive**
- **Chuyển function thành async**: `export default async function Home()`
- **Fetch dữ liệu trực tiếp trên server** thay vì `useEffect`:

  ```tsx
  // Trước (Client-side):
  useEffect(() => {
    const fetchMovies = async () => {
      const movies = await movieService.getAllWithDetails();
      setAllMovies(movies);
    };
    fetchMovies();
  }, []);

  // Sau (Server-side):
  const movies = await movieService.getAllWithDetails();
  allMovies = Array.isArray(movies) ? movies : [];
  ```

### ✅ 2. Thêm Metadata cho SEO

Đã thêm metadata đầy đủ:

```tsx
export const metadata: Metadata = {
  title: "Trang chủ - CinemaHub | Đặt vé phim online nhanh chóng",
  description: "Khám phá những bộ phim blockbuster...",
  keywords: [
    "đặt vé phim",
    "rạp chiếu phim",
    "phim đang chiếu",
    "phim sắp chiếu",
    "cinema",
    "movie tickets",
    "đặt vé online",
  ],
  openGraph: {
    title: "CinemaHub - Đặt vé phim online nhanh chóng",
    description: "Trải nghiệm điện ảnh đỉnh cao...",
    type: "website",
  },
};
```

### ✅ 3. Loại bỏ Loading State

- **Xóa `useState` và loading spinner** - Không cần vì dữ liệu đã có sẵn khi render
- **Giảm JavaScript bundle size** - Không import `Loader2` icon nữa
- **Cải thiện UX** - Người dùng thấy nội dung ngay lập tức

### ✅ 4. Giữ nguyên Client Components khi cần thiết

- **`Carousel`** - Vẫn là client component (cần useState, useEffect cho auto-play)
- **`MovieTabs`** - Vẫn là client component (cần useState cho tab switching)
- **Tách biệt rõ ràng** - Server component chính pass data xuống client components

## Lợi ích SEO

### 🚀 Cải thiện Core Web Vitals

1. **First Contentful Paint (FCP)** ⬇️ - Nội dung hiển thị nhanh hơn
2. **Largest Contentful Paint (LCP)** ⬇️ - Hero carousel được render sẵn
3. **Cumulative Layout Shift (CLS)** ⬇️ - Không có loading skeleton shift

### 🔍 Tối ưu cho Search Engines

1. **Server-side Rendering (SSR)** - HTML đầy đủ được gửi ngay từ server
2. **Meta tags đầy đủ** - Title, description, keywords, OpenGraph
3. **Content indexable** - Search engines thấy toàn bộ nội dung ngay lập tức
4. **Semantic HTML** - Cấu trúc heading (h1, h2) rõ ràng

### ⚡ Performance

1. **Ít JavaScript hơn** - Không cần React hooks cho data fetching
2. **Bundle size nhỏ hơn** - Loại bỏ useState, useEffect khỏi main page
3. **Faster Time to Interactive (TTI)** - Nội dung static không cần JS

## Kiến trúc mới

```
app/page.tsx (Server Component)
├── Fetch data on server
├── Export metadata
└── Render JSX với data có sẵn
    ├── Carousel (Client Component) - Auto-play, navigation
    └── MovieTabs (Client Component) - Tab switching
```

## Các trang khác cần tối ưu tương tự

Áp dụng pattern này cho các trang khác:

- [ ] `/movies` - Danh sách phim
- [ ] `/cinemas` - Danh sách rạp
- [ ] `/promotions` - Khuyến mãi
- [ ] `/movie/[id]` - Chi tiết phim (dynamic route)
- [ ] `/cinemas/[id]` - Chi tiết rạp (dynamic route)

## Best Practices áp dụng

1. ✅ **Server Component by default** - Chỉ dùng Client Component khi cần
2. ✅ **Metadata cho mọi page** - Title, description unique cho từng trang
3. ✅ **Semantic HTML** - h1, h2, section tags đúng cách
4. ✅ **Error handling** - Graceful error state khi API fail
5. ✅ **Type safety** - TypeScript types đầy đủ

## Kết luận

Trang chủ đã được tối ưu hoá SEO thành công bằng cách:

- Chuyển đổi từ Client Component sang Server Component
- Thêm metadata đầy đủ
- Giảm JavaScript bundle size
- Cải thiện First Paint và Time to Interactive
- Đảm bảo nội dung được index đầy đủ bởi search engines

**Kết quả**: Trang chủ giờ đây thân thiện với SEO, performance tốt hơn, và trải nghiệm người dùng được cải thiện đáng kể.
