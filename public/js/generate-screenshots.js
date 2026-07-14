// File: scripts/generate-screenshots.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const USERNAME = 'hayaxxdev-bit'; // Ganti dengan username kamu
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

// Daftar repo yang memiliki GitHub Pages
const repos = [
  'nexovra', // nama repo yang ada Pages-nya
  // tambahkan repo lain
];

async function takeScreenshot(url, filename) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, filename),
      type: 'jpeg',
      quality: 85,
      clip: { x: 0, y: 0, width: 1280, height: 800 }
    });
    
    console.log(`✅ Screenshot saved: ${filename}`);
  } catch (error) {
    console.error(`❌ Failed: ${url}`, error.message);
  } finally {
    await browser.close();
  }
}

async function main() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
  
  for (const repo of repos) {
    const url = `https://${USERNAME}.github.io/${repo}`;
    await takeScreenshot(url, `${repo}.jpg`);
  }
  
  // Generate JSON manifest
  const manifest = repos.map(repo => ({
    repo,
    screenshot: `screenshots/${repo}.jpg`,
    updated: new Date().toISOString()
  }));
  
  fs.writeFileSync(
    path.join(SCREENSHOTS_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('✅ All screenshots generated!');
}

main();