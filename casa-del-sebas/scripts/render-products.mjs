// Renders the catalogue photos from the 3D pieces into src/assets/products/*.webp.
// Run with: npm run render:products            (all of them)
//           npm run render:products -- soga-5  (only some)
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright-core';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = new URL('../src/assets/products/', import.meta.url);
const only = process.argv.slice(2);

const server = await createServer({ root, configFile: false, logLevel: 'error', server: { port: 5198 } });
await server.listen();

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

try {
  const page = await browser.newPage();
  page.on('pageerror', (err) => console.error(err));
  page.on('console', (msg) => msg.type() === 'error' && console.error(msg.text()));
  await page.goto(`${server.resolvedUrls.local[0]}render.html`);
  await page.waitForFunction(() => Array.isArray(window.shotIds));
  const ids = (await page.evaluate(() => window.shotIds)).filter((id) => !only.length || only.includes(id));

  await mkdir(outDir, { recursive: true });
  for (const id of ids) {
    const dataUrl = await page.evaluate((id) => window.shoot(id), id);
    await writeFile(new URL(`${id}.webp`, outDir), Buffer.from(dataUrl.split(',')[1], 'base64'));
    console.log(`✓ src/assets/products/${id}.webp`);
  }
} finally {
  await browser.close();
  await server.close();
}
