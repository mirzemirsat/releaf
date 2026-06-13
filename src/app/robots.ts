import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/checkout", "/api/", "/admin"] },
    sitemap: "https://releaf.example.com/sitemap.xml",
  };
}
