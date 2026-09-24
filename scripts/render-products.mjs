// Renders the product and detail images from the 3D garments into
// public/products/*.webp. Run with: npm run render:products
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright-core';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = new URL('../public/products/', import.meta.url);

const server = await createServer({ root, logLevel: 'error', server: { port: 5199 } });
await server.listen();

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

try {
  const page = await browser.newPage();
  page.on('pageerror', (err) => console.error(err));
  await page.goto(`${server.resolvedUrls.local[0]}render.html`);
  await page.waitForFunction(() => typeof window.renderAll === 'function');
  const images = await page.evaluate(() => window.renderAll());

  await mkdir(outDir, { recursive: true });
  for (const [name, dataUrl] of Object.entries(images)) {
    const file = new URL(`${name}.webp`, outDir);
    await writeFile(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
    console.log(`✓ public/products/${name}.webp`);
  }
} finally {
  await browser.close();
  await server.close();
}
