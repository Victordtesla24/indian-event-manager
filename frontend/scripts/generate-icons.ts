import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SOURCE_ICON = path.join(__dirname, '../src/assets/ganesha.svg');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');

async function generateIcons() {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Generate icons for each size
    await Promise.all(
      SIZES.map(async (size) => {
        const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
        await sharp(SOURCE_ICON, { density: 300 })
          .resize(size, size, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .png()
          .toFile(outputPath);
        console.log(`Generated ${size}x${size} icon`);
      })
    );

    // Generate splash screens for iOS
    const splashSizes = [
      { width: 2048, height: 2732 }, // 12.9" iPad Pro
      { width: 1668, height: 2388 }, // 11" iPad Pro
      { width: 1536, height: 2048 }, // 10.5" iPad Pro
      { width: 1125, height: 2436 }, // iPhone X/XS
      { width: 1242, height: 2688 }  // iPhone XS Max
    ];

    await Promise.all(
      splashSizes.map(async ({ width, height }) => {
        const outputPath = path.join(OUTPUT_DIR, `splash-${width}x${height}.png`);
        const iconSize = Math.floor(Math.min(width, height) * 0.4); // 40% of smallest dimension
        await sharp(SOURCE_ICON, { density: 300 })
          .resize(iconSize, iconSize, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .extend({
            top: Math.floor((height - iconSize) / 2),
            bottom: Math.floor((height - iconSize) / 2),
            left: Math.floor((width - iconSize) / 2),
            right: Math.floor((width - iconSize) / 2),
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .png()
          .toFile(outputPath);
        console.log(`Generated ${width}x${height} splash screen`);
      })
    );

    // Generate favicon.ico
    await sharp(SOURCE_ICON, { density: 300 })
      .resize(32, 32)
      .toFile(path.join(OUTPUT_DIR, '../favicon.ico'));
    console.log('Generated favicon.ico');

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

// Run the script
generateIcons();
