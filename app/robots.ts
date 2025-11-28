import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cinemahub.com";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin/",
                    "/api/",
                    "/book-ticket/",
                    "/profile/",
                    "/_next/",
                    "/payment/",
                ],
            },
            // Special rule for admin - completely block
            {
                userAgent: "*",
                disallow: ["/admin"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
