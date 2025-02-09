import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Event } from '../src/stores/eventStore.ts';
import mockEvents from '../src/data/mockEvents.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://example.com';
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const staticPages: SitemapEntry[] = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/natak', changefreq: 'daily', priority: 0.9 },
  { loc: '/cinema', changefreq: 'daily', priority: 0.9 },
  { loc: '/musicals', changefreq: 'daily', priority: 0.9 },
  { loc: '/events', changefreq: 'daily', priority: 0.9 },
  { loc: '/fun', changefreq: 'daily', priority: 0.9 },
  { loc: '/folk', changefreq: 'daily', priority: 0.9 },
  { loc: '/login', changefreq: 'monthly', priority: 0.5 },
  { loc: '/register', changefreq: 'monthly', priority: 0.5 },
];

function generateEventEntries(events: Event[]): SitemapEntry[] {
  return events.map((event) => ({
    loc: `/event/${event.id}`,
    lastmod: event.updatedAt,
    changefreq: 'daily',
    priority: 0.8,
  }));
}

function generateSitemapXML(entries: SitemapEntry[]): string {
  const entriesXML = entries
    .map(
      (entry) => `  <url>
    <loc>${SITE_URL}${entry.loc}</loc>${
        entry.lastmod ? `\n    <lastmod>${entry.lastmod.split('T')[0]}</lastmod>` : ''
      }
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entriesXML}
</urlset>`;
}

async function generateSitemap() {
  try {
    // In production, you would fetch events from your API
    const events = mockEvents;
    const eventEntries = generateEventEntries(events);
    const allEntries = [...staticPages, ...eventEntries];
    const sitemapXML = generateSitemapXML(allEntries);

    fs.writeFileSync(SITEMAP_PATH, sitemapXML);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the script
generateSitemap();
