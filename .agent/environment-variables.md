# Environment Variables Configuration

## Required for SEO (Production)

```bash
# Base URL for sitemap and canonical URLs
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Local Development

```bash
# For local development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## How to use

1. Create a `.env.local` file in the root directory
2. Add the environment variables above
3. Restart your development server

## Notes

- `NEXT_PUBLIC_*` variables are exposed to the browser
- Used in `app/sitemap.ts` and `app/robots.ts` for generating absolute URLs
- Change to your actual domain when deploying to production
