import type { MetadataRoute } from "next";

enum ChangeFrequencyEnum {
    ALWAYS = "always",
    HOURLY = "hourly",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly",
    NEVER = "never",
}

export default function sitemap(): MetadataRoute.Sitemap {
    // Base URLs for the site
    const baseUrl = "https://www.lexisort.dev";

    // Static routes with metadata
    const routes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: ChangeFrequencyEnum.WEEKLY,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: ChangeFrequencyEnum.MONTHLY,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/features`,
            lastModified: new Date(),
            changeFrequency: ChangeFrequencyEnum.MONTHLY,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/register`,
            lastModified: new Date(),
            changeFrequency: ChangeFrequencyEnum.MONTHLY,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: ChangeFrequencyEnum.MONTHLY,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/help`,
            lastModified: new Date(),
            changeFrequency: ChangeFrequencyEnum.WEEKLY,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: ChangeFrequencyEnum.MONTHLY,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: ChangeFrequencyEnum.WEEKLY,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/api`,
            lastModified: new Date(),
            changeFrequency: ChangeFrequencyEnum.MONTHLY,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: ChangeFrequencyEnum.YEARLY,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: ChangeFrequencyEnum.YEARLY,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/cookies`,
            lastModified: new Date(),
            changeFrequency: ChangeFrequencyEnum.YEARLY,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/security`,
            lastModified: new Date(),
            changeFrequency: ChangeFrequencyEnum.YEARLY,
            priority: 0.5,
        },
    ];

    // TODO: In a real application, you would fetch dynamic routes here
    // For example, blog posts from a CMS or database
    // const blogPosts = await fetchBlogPosts();
    // const dynamicRoutes = blogPosts.map(post => ({
    //   url: `${baseUrl}/blog/${post.slug}`,
    //   lastModified: new Date(post.updatedAt),
    //   changeFrequency: 'monthly' as ChangeFrequency,
    //   priority: 0.6,
    // }));

    // return [...routes, ...dynamicRoutes];
    return routes;
}
