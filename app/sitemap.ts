import { MetadataRoute } from "next";
import { movieService, cinemaService } from "@/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cinemahub.com";

    try {
        // Fetch all movies and cinemas for dynamic URLs
        const [movies, cinemas] = await Promise.all([
            movieService.getAll(),
            cinemaService.getAll(),
        ]);

        // Base static routes
        const staticRoutes: MetadataRoute.Sitemap = [
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
                priority: 0.8,
            },
            {
                url: `${baseUrl}/promotions`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: 0.7,
            },
        ];

        // Dynamic movie routes
        const movieRoutes: MetadataRoute.Sitemap = Array.isArray(movies)
            ? movies.map((movie) => ({
                url: `${baseUrl}/movie/${movie.movie_id}`,
                lastModified: new Date(),
                changeFrequency: "weekly" as const,
                priority: 0.8,
            }))
            : [];

        // Dynamic cinema routes
        const cinemaRoutes: MetadataRoute.Sitemap = Array.isArray(cinemas)
            ? cinemas.map((cinema) => ({
                url: `${baseUrl}/cinemas/${cinema.cinema_id}`,
                lastModified: new Date(),
                changeFrequency: "weekly" as const,
                priority: 0.7,
            }))
            : [];

        return [...staticRoutes, ...movieRoutes, ...cinemaRoutes];
    } catch (error) {
        console.error("Error generating sitemap:", error);
        // Return at least static routes if dynamic fetch fails
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: "daily",
                priority: 1,
            },
        ];
    }
}
