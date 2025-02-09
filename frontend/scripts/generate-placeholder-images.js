import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePlaceholderImages() {
  const carouselDir = path.join(__dirname, '../public/images/carousel');
  const eventsDir = path.join(__dirname, '../public/images/events');

  // Ensure directories exist
  await fs.mkdir(carouselDir, { recursive: true });
  await fs.mkdir(eventsDir, { recursive: true });

  // Generate carousel banner images (4000x1000 for desktop)
  const carouselEvents = [
    { name: 'shikayala-gelo-ek-banner', color: '#FF6B6B' },
    { name: 'jyachi-tyachi-banner', color: '#4ECDC4' },
    { name: 'punha-sahi-banner', color: '#45B7D1' },
    { name: 'eka-lagnachi-banner', color: '#96CEB4' },
    { name: 'niyam-va-ati-banner', color: '#FFEEAD' },
  ];

  for (const event of carouselEvents) {
    await sharp({
      create: {
        width: 4000,
        height: 1000,
        channels: 4,
        background: event.color,
      }
    })
    .jpeg()
    .toFile(path.join(carouselDir, `${event.name}.jpg`));
  }

  // Generate event poster images (1000x1500)
  const eventPosters = [
    { name: 'shikayala-gelo-ek', color: '#FF6B6B' },
    { name: 'jyachi-tyachi', color: '#4ECDC4' },
    { name: 'punha-sahi', color: '#45B7D1' },
    { name: 'eka-lagnachi', color: '#96CEB4' },
    { name: 'niyam-va-ati', color: '#FFEEAD' },
  ];

  for (const poster of eventPosters) {
    await sharp({
      create: {
        width: 1000,
        height: 1500,
        channels: 4,
        background: poster.color,
      }
    })
    .jpeg()
    .toFile(path.join(eventsDir, `${poster.name}.jpg`));
  }

  console.log('Placeholder images generated successfully!');
}

generatePlaceholderImages().catch(console.error);
