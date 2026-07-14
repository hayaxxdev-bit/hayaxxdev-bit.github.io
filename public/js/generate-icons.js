// generate-icons.js
const sharp = require('sharp');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceImage = './public/image/android-chrome-192x192.png';

if (!fs.existsSync('./public/icons')) {
  fs.mkdirSync('./public/icons', { recursive: true });
}

async function generateIcons() {
  try {
    for (const size of sizes) {
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png({
          quality: 80,
          compressionLevel: 9
        })
        .toFile(`./public/icons/icon-${size}.png`);
      
      console.log(`✅ Generated icon-${size}.png`);
    }

    // Generate maskable icon (dengan padding)
    await sharp(sourceImage)
      .resize(512, 512, {
        fit: 'cover',
        position: 'center'
      })
      .extend({
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
        background: { r: 5, g: 3, b: 8, alpha: 1 }
      })
      .png({
        quality: 80,
        compressionLevel: 9
      })
      .toFile('./public/icons/icon-512-maskable.png');
    
    console.log('✅ Generated icon-512-maskable.png');

    // Generate shortcut icons
    const shortcutSizes = [96];
    for (const size of shortcutSizes) {
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png({
          quality: 80,
          compressionLevel: 9
        })
        .toFile(`./public/icons/shortcut-home-${size}.png`);
      
      console.log(`✅ Generated shortcut-home-${size}.png`);
    }

    // Copy untuk shortcut lain (atau generate berbeda)
    for (const name of ['projects', 'about', 'contact']) {
      await sharp(sourceImage)
        .resize(96, 96, {
          fit: 'cover',
          position: 'center'
        })
        .tint({ r: 124, g: 58, b: 237 })
        .png({
          quality: 80,
          compressionLevel: 9
        })
        .toFile(`./public/icons/shortcut-${name}-96.png`);
      
      console.log(`✅ Generated shortcut-${name}-96.png`);
    }

    console.log('🎉 All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

generateIcons();