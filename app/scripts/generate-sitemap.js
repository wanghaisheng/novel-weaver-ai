// scripts/generate-sitemap.js
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

// Define your application's base URL
const BASE_URL = 'https://novelweaver.deepseek.diy'; // Match your production URL

// Define supported languages (codes)
// This should align with your i18n setup
const supportedLanguages = ['en', 'ko', 'es', 'fr', 'zh-CN', 'ja'];

// Define your application's routes
const routes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/tool', changefreq: 'weekly', priority: 0.8 },
  { url: '/pricing', changefreq: 'monthly', priority: 0.7 },
  { url: '/signin', changefreq: 'monthly', priority: 0.5 },
  { url: '/signup', changefreq: 'monthly', priority: 0.5 },
  { url: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
  { url: '/terms-of-service', changefreq: 'yearly', priority: 0.3 },
  { url: '/about-us', changefreq: 'monthly', priority: 0.4 },
  { url: '/contact-us', changefreq: 'yearly', priority: 0.3 },
  // Add other publicly accessible routes here
];

async function generateSitemap() {
  try {
    const smStream = new SitemapStream({ hostname: BASE_URL });
    const sitemapPath = path.resolve(__dirname, '../public', 'sitemap.xml');
    const writeStream = createWriteStream(sitemapPath);

    smStream.pipe(writeStream);

    routes.forEach(route => {
      const links = supportedLanguages.map(lang => ({
        lang: lang,
        url: `${route.url}`, // Assumes language is handled by path prefix or query param by your app/CDN
                               // If not, and language uses same URL, this structure is fine for telling Google about alternates.
      }));
      
      smStream.write({
        url: route.url,
        changefreq: route.changefreq,
        priority: route.priority,
        links: links,
        lastmod: new Date().toISOString().split('T')[0], // Today's date
      });
    });

    smStream.end();
    await streamToPromise(smStream);
    
    console.log(`Sitemap successfully generated at ${sitemapPath}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1); // Exit with error code
  }
}

generateSitemap();
