import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SOURCE_ICON = join(__dirname, '../public/icons/favicon-32x32.png');
const ICONS_DIR = join(__dirname, '../public/icons');

const ICON_SIZES = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
  { size: 144, name: 'mstile-144x144.png' }
];

async function validateImage(buffer) {
  try {
    const metadata = await sharp(buffer).metadata();
    console.log('Source image metadata:', metadata);
    return true;
  } catch (error) {
    console.error('Image validation failed:', error.message);
    return false;
  }
}

async function generateIcons() {
  try {
    // Ensure icons directory exists
    await fs.mkdir(ICONS_DIR, { recursive: true });

    // Read and validate the source icon
    console.log('Reading source icon from:', SOURCE_ICON);
    const sourceBuffer = await fs.readFile(SOURCE_ICON);
    
    if (!await validateImage(sourceBuffer)) {
      throw new Error('Invalid source image. Please ensure it is a valid PNG file.');
    }

    // Convert source to PNG if it isn't already
    const pngBuffer = await sharp(sourceBuffer)
      .png()
      .toBuffer();

    // Generate each size
    for (const icon of ICON_SIZES) {
      console.log(`Generating ${icon.name}...`);
      await sharp(pngBuffer)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(join(ICONS_DIR, icon.name));
    }

    // For favicon.ico, use the 32x32 PNG
    await fs.copyFile(join(ICONS_DIR, 'favicon-32x32.png'), join(ICONS_DIR, 'favicon.ico'));

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

generateIcons(); 