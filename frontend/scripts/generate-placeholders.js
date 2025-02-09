import puppeteer from 'puppeteer';
import path from 'path';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generatePlaceholders() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to match our desired image sizes
  await page.setViewport({ width: 2000, height: 1500 });
  
  // Load the placeholder HTML file
  await page.goto(`file://${path.resolve(path.join(__dirname, '../public/images/events/placeholder.html'))}`);
  
  // Wait for the page to load
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
  
  // Create directories if they don't exist
  await mkdir(path.join(__dirname, '../public/images/events'), { recursive: true });
  await mkdir(path.join(__dirname, '../public/images/banners'), { recursive: true });
  
  // Generate event poster images (1000x1500)
  const eventNames = [
    'kathak-festival',
    'ramayana-musical',
    'bharatanatyam',
    'fusion-night',
    'odissi-ensemble',
    'bollywood-awards',
    'folk-festival'
  ];
  
  for (let i = 0; i < eventNames.length; i++) {
    const element = await page.$(`div.gradient:nth-of-type(${i + 1})`);
    await element.screenshot({
      path: path.join(__dirname, `../public/images/events/${eventNames[i]}.jpg`),
      type: 'jpeg',
      quality: 90
    });
  }
  
  // Generate banner images (2000x1000)
  for (let i = 0; i < eventNames.length; i++) {
    const element = await page.$(`div.gradient.banner:nth-of-type(${i + 8})`);
    await element.screenshot({
      path: path.join(__dirname, `../public/images/banners/${eventNames[i]}-banner.jpg`),
      type: 'jpeg',
      quality: 90
    });
  }
  
  await browser.close();
  console.log('Placeholder images generated successfully!');
}

generatePlaceholders().catch(console.error);
