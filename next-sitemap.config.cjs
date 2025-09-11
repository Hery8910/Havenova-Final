module.exports = {
    siteUrl: "https://havenova.de",
    generateRobotsTxt: true,
    sitemapSize: 7000,
    changefreq: "weekly",
    priority: 0.7,
    exclude: ["/admin/*", "/usuario/*"],
  };// next-sitemap.config.js
  module.exports = {
      siteUrl: "https://havenova.de", // Asegúrate que sea tu dominio final
      generateRobotsTxt: true,
      sitemapSize: 7000,
      changefreq: "weekly",
      priority: 0.7,
    
      exclude: [
        "/admin/*",
        "/usuario/*",
        "/checkout",
        "/dashboard/*",
        "/api/*",
      ],
    
      robotsTxtOptions: {
        policies: [
          {
            userAgent: "*",
            allow: "/",
            disallow: [ "/user", "/checkout", "/dashboard"],
          },
        ],
      },
    };
    